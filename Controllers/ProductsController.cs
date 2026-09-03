using CrapCart.Data;
using CrapCart.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CrapCart.Controllers;

[ApiController]
[Route("api/[controller]")]
    public class ProductsController(StoreContext context) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<Product>>> GetProducts()
        {
            return await context.Products.ToListAsync();
        }
    [HttpGet("{id}")]
    public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await context.Products.FindAsync(id);

            if (product == null)
                {
                    return NotFound();
                }

                    return product;
        }
}
    