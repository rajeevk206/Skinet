using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Core.Entities.OrderAggregate
{
    public class OrderItem
    {
        public int Id { get; set;} 
         public ProductItemOrdered ItemOrdered { get; set; } = null!;
        public decimal Price { get; set; }
        public int Quantity { get; set; }
    }
}