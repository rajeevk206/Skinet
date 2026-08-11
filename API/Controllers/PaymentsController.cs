using API.Extensions;
using API.SignalR;
using Core.Entities;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Core.Specifications;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Stripe;

namespace API.Controllers;

public class PaymentsController(IPaymentService paymentService, IUnitOfWork unit,
    ILogger<PaymentsController> logger, IConfiguration config, IHubContext<NotificationHub> hubContext) : BaseApiController
{
    private readonly string _whSecret = config["StripeSettings:WhSecret"]!;

    [Authorize]
    [HttpPost("{cartId}")]
    public async Task<ActionResult<ShoppingCart>> CreateOrUpdatePaymentIntent(string cartId)
    {
        var cart =
            await paymentService.CreateOrUpdatePaymentIntent(cartId);

        if (cart == null)  // some time error
            return BadRequest("Problem with your cart");

        if (!string.IsNullOrWhiteSpace(cart.PaymentIntentId))
        {
            var spec = new OrderSpecification(
                cart.PaymentIntentId,
                true
            );

            var existingOrder =
                await unit.Repository<Order>().GetEntityWithSpec(spec);

            if (
                existingOrder != null &&
                (
                    existingOrder.Status == OrderStatus.PaymentReceived ||
                    existingOrder.Status == OrderStatus.PaymentMismatch
                )
            )
            {
                logger.LogWarning(
                    "Cart {CartId} contains a stale PaymentIntent {PaymentIntentId}. " +
                    "The related order {OrderId} is already paid.",
                    cartId,
                    cart.PaymentIntentId,
                    existingOrder.Id
                );

                return BadRequest(
                    "This payment has already been processed. Please start a new checkout."
                );
            }
        }

        return Ok(cart);
    }

    [HttpGet("delivery-methods")]
    public async Task<ActionResult<IReadOnlyList<DeliveryMethod>>> GetDeliveryMethods()
    {
        return Ok(
            await unit.Repository<DeliveryMethod>().ListAllAsync()
        );
    }

    [AllowAnonymous]
    [HttpPost("webhook")]
    public async Task<IActionResult> StripeWebhook()
    {
        Request.EnableBuffering();

        Request.Body.Position = 0;

        var json = await new StreamReader(
            Request.Body,
            leaveOpen: true
        ).ReadToEndAsync();

        Request.Body.Position = 0;

        var signatureHeader = GetStripeSignatureHeader();

        try
        {
            var stripeEvent = ConstructStripeEvent(json, signatureHeader);

            logger.LogInformation(
                "Stripe webhook received: {EventType}",
                stripeEvent.Type
            );

            // Only handle payment_intent.succeeded
            if (stripeEvent.Type != EventTypes.PaymentIntentSucceeded)
            {
                logger.LogInformation(
                    "Ignoring Stripe event: {EventType}",
                    stripeEvent.Type
                );

                return Ok();
            }

            if (stripeEvent.Data.Object is not PaymentIntent intent)
            {
                logger.LogWarning(
                    "Stripe event does not contain a PaymentIntent"
                );

                return BadRequest("Invalid event data");
            }

            await HandlePaymentIntentSucceeded(intent);

            return Ok();
        }
        catch (StripeException ex)
        {
            logger.LogError(
                ex,
                "Stripe webhook error"
            );

            return BadRequest("Invalid Stripe webhook");
        }
        catch (Exception ex)
        {
            logger.LogError(
                ex,
                "An unexpected error occurred while processing Stripe webhook"
            );

            return StatusCode(
                StatusCodes.Status500InternalServerError,
                "Webhook processing failed"
            );
        }
    }

    private async Task HandlePaymentIntentSucceeded(PaymentIntent intent)
    {
        if (intent.Status != "succeeded")
            return;

        logger.LogInformation(
            "PaymentIntent succeeded: {PaymentIntentId}",
            intent.Id
        );

        var spec = new OrderSpecification(
            intent.Id,
            true
        );

        var order =
            await unit.Repository<Order>()
                .GetEntityWithSpec(spec);

        // IMPORTANT:
        // Stripe can send the webhook before your order exists.
        if (order == null)
        {
            logger.LogWarning(
                "No order found for PaymentIntent {PaymentIntentId}",
                intent.Id
            );

            return;
        }

        var orderTotalInCents =
            (long)Math.Round(
                order.GetTotal() * 100,
                MidpointRounding.AwayFromZero
            );

        if (orderTotalInCents != intent.Amount)
        {
            logger.LogWarning(
                "Payment mismatch for Order {OrderId}. " +
                "Expected {ExpectedAmount}, Stripe received {StripeAmount}",
                order.Id,
                orderTotalInCents,
                intent.Amount
            );

            order.Status = OrderStatus.PaymentMismatch;
        }
        else
        {
            logger.LogInformation(
                "Payment received for Order {OrderId}",
                order.Id
            );

            order.Status = OrderStatus.PaymentReceived;
        }

        await unit.Complete();

        var connectionId =
            NotificationHub.GetConnectionIdByEmail(
                order.BuyerEmail
            );

        if (!string.IsNullOrEmpty(connectionId))
        {
            await hubContext.Clients
                .Client(connectionId)
                .SendAsync(
                    "OrderCompleteNotification",
                    order.ToDto()
                );
        }
    }

    private string GetStripeSignatureHeader()
    {
        if (!Request.Headers.TryGetValue(
                "Stripe-Signature",
                out var headerValues))
        {
            return string.Empty;
        }

        return string.Join(
            ",",
            headerValues
                .Select(v => v.Trim())
                .Where(v => !string.IsNullOrWhiteSpace(v))
        );
    }

    private Event ConstructStripeEvent(string json, string signatureHeader)
{
    if (string.IsNullOrWhiteSpace(_whSecret))
        throw new StripeException("Stripe webhook secret is not configured.");

    if (string.IsNullOrWhiteSpace(signatureHeader))
        throw new StripeException("Missing Stripe-Signature header.");

    try
    {
        return EventUtility.ConstructEvent(
            json,
            signatureHeader,
            _whSecret
        );
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Failed to construct Stripe event. Message: {Message}", ex.Message);
        throw new StripeException(ex.Message);
    }

}
    
}