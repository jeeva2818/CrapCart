using CrapCart.Data;
using CrapCart.Entities;
using CrapCart.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using CrapCart.RequestHelpers;

namespace CrapCart.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController(StoreContext context) : ControllerBase
{
    [HttpGet]
public async Task<ActionResult<List<Product>>> GetProducts(
    [FromQuery] ProductsParams productParams)
    {
        var query = context.Products
            .AsQueryable()
            .Sort(productParams.OrderBy)
            .Search(productParams.SearchTerm)
            .Filter(productParams.Brands, productParams.Types);
        var products = await PagedList<Product>.ToPagedList(
            query,
            productParams.PageNumber,
            productParams.PageSize);
            Response.AddPaginationHeader(products.Metadata);
            return products;
    }
    [HttpGet("filters")]
public async Task<IActionResult> GetFilters()
{
    var brands = await context.Products
        .Select(x => x.Brand)
        .Distinct()
        .ToListAsync();

    var types = await context.Products
        .Select(x => x.Type)
        .Distinct()
        .ToListAsync();

    return Ok(new { brands, types });
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