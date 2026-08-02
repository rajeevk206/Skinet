using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;

namespace Core.Specifications
{
    public class ProductSpecification : BaseSpecification<Product>
    {
        public ProductSpecification(string? brand, string? type, string? sort) : base(x =>
        (string.IsNullOrWhiteSpace(brand) || x.Brand == brand) &&
        (string.IsNullOrWhiteSpace(type) || x.Type == type)
        // (string.IsNullOrEmpty(specParams.Search) || x.Name.ToLower().Contains(specParams.Search)) &&
        // (specParams.Brands.Count == 0 || specParams.Brands.Contains(x.Brand)) &&
        // (specParams.Types.Count == 0 || specParams.Types.Contains(x.Type))
    )
        {
            //ApplyPaging(specParams.PageSize * (specParams.PageIndex -1), specParams.PageSize);

            switch (sort)
            {
                case "priceAsc":
                    AddOrderBy(x => x.Price);
                    break;
                case "priceDesc":
                    AddOrderByDescending(x => x.Price);
                    break;
                default:
                    AddOrderBy(x => x.Name);
                    break;
            }
        }
    }
}