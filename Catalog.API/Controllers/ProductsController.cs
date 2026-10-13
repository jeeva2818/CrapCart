using AutoMapper;
using Catalog.API.Data;
using Catalog.API.Dtos;
using Catalog.API.Entities;
using Catalog.API.Extensions;
using Catalog.API.RequestHelpers;
using Catalog.API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Catalog.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController(
    CatalogContext context,
    IMapper mapper,
    ImageService imageService) : ControllerBase
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

    [HttpPost]
    public async Task<ActionResult<Product>> CreateProduct([FromForm] CreateProductDto productDto)
    {
        var product = mapper.Map<Product>(productDto);

        if (productDto.File != null)
        {
            var imageResult = await imageService.AddImageAsync(productDto.File);

            if (imageResult.Error != null)
            {
                return BadRequest(imageResult.Error.Message);
            }

            product.ImageUrl = imageResult.SecureUrl.AbsoluteUri;
            product.PublicId = imageResult.PublicId;
        }

        context.Products.Add(product);

        var result = await context.SaveChangesAsync();

        if (result > 0)
        {
            return CreatedAtAction(
                nameof(GetProduct),
                new { id = product.Id },
                product);
        }

        return BadRequest("Problem creating new product");
    }

    [HttpPut]
    public async Task<ActionResult> UpdateProduct([FromForm] UpdateProductDto updateProductDto)
    {
        var product = await context.Products.FindAsync(updateProductDto.Id);

        if (product == null)
        {
            return NotFound();
        }

        mapper.Map(updateProductDto, product);

        if (updateProductDto.File != null)
        {
            var imageResult = await imageService.AddImageAsync(updateProductDto.File);

            if (imageResult.Error != null)
            {
                return BadRequest(imageResult.Error.Message);
            }

            if (!string.IsNullOrEmpty(product.PublicId))
            {
                await imageService.DeleteImageAsync(product.PublicId);
            }

            product.ImageUrl = imageResult.SecureUrl.AbsoluteUri;
            product.PublicId = imageResult.PublicId;
        }

        var result = await context.SaveChangesAsync();

        if (result > 0)
        {
            return NoContent();
        }

        return BadRequest("Problem updating product");
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteProduct(int id)
    {
        var product = await context.Products.FindAsync(id);

        if (product == null)
        {
            return NotFound();
        }

        if (!string.IsNullOrEmpty(product.PublicId))
        {
            await imageService.DeleteImageAsync(product.PublicId);
        }

        context.Products.Remove(product);

        var result = await context.SaveChangesAsync();

        if (result > 0)
        {
            return Ok();
        }

        return BadRequest("Problem deleting the product");
    }
}
