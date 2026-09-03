using System;

namespace CrapCart.Entities
{
    public class Product
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public decimal Price { get; set; }
        public required string Description { get; set; }
        public required string ImageUrl { get; set; }
        public required string Type { get; set; }    
        public required string Brand { get; set; }
        public int QuantityInStock { get; set; }


    }
}