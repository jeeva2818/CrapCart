
using AutoMapper;
using CrapCart.Dtos;
using CrapCart.Entities;

namespace CrapCart.Helpers;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        CreateMap<Product, Product>();

        CreateMap<CreateProductDto, Product>()
            .ForMember(d => d.PublicId, o => o.Ignore())
            .ForMember(d => d.ImageUrl, o => o.Ignore())
            .ForMember(d => d.QuantityInStock, o => o.MapFrom(s => s.Quantity));

        CreateMap<UpdateProductDto, Product>()
            .ForMember(d => d.PublicId, o => o.Ignore())
            .ForMember(d => d.ImageUrl, o => o.Ignore())
            .ForMember(d => d.QuantityInStock, o => o.MapFrom(s => s.Quantity));
    }
}
