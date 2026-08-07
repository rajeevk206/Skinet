using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Core.Interfaces;
using Infrastructure.Data;
using Microsoft.Extensions.Configuration;
using Stripe;

namespace Infrastructure.Services
{
    public class PaymentService(IConfiguration config, ICartService cartService, 
        GenericRepository<Core.Entities.Product> productRepo, GenericRepository<DeliveryMethod> dmRepo) : IPaymentService
    {
        public async Task<ShoppingCart?> CreateOrUpdatePaymentIntent(string cartId)
        {
            StripeConfiguration.ApiKey = config["StripeSettings:SecretKey"];

            var cart = await cartService.GetCartAsync(cartId);
            
             if (cart == null) return null;
           
            var shippingPrice = 0m;

            if(cart.DeliveryMethodId.HasValue)
            {
                var deliveryMethod = await dmRepo.GetByIdAsync((int)cart.DeliveryMethodId);

                if (deliveryMethod == null) return null;

                shippingPrice =  deliveryMethod.Price;
            }

            foreach(var item in cart.Items)
            {
                var productItem = await productRepo.GetByIdAsync(item.ProductId);
                if (productItem == null) return null;

                if(item.Price != productItem.Price)
                {
                    item.Price = productItem.Price;
                }
            }

            var service = new PaymentIntentService();
            PaymentIntent? intent = null;
            
            if (string.IsNullOrEmpty(cart.PaymentIntentId))
            {
                var createOptions = new PaymentIntentCreateOptions
                {
                    Amount = (long)cart.Items.Sum(x => x.Quantity * (x.Price * 100))
                                + (long)shippingPrice * 100,
                    Currency = "usd",
                    PaymentMethodTypes =[ "card" ]
                };
            
                intent = await service.CreateAsync(createOptions);
                cart.PaymentIntentId = intent.Id;
                cart.ClientSecret = intent.ClientSecret;
            }
            else
            {
                var Options = new PaymentIntentUpdateOptions
                {
                    Amount = (long)cart.Items.Sum(x => x.Quantity * (x.Price * 100))
                                + (long)shippingPrice * 100,
                };
            
                intent = await service.UpdateAsync(cart.PaymentIntentId, Options);
            }
            
            await cartService.SetCartAsync(cart);
            return cart;

        }
    }

    
}