using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CrapCart.Migrations
{
    /// <inheritdoc />
    public partial class CouponsAdded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "Coupon_AmountOff",
                table: "Baskets",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Coupon_CouponId",
                table: "Baskets",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Coupon_Name",
                table: "Baskets",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Coupon_PercentOff",
                table: "Baskets",
                type: "TEXT",
                precision: 5,
                scale: 2,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Coupon_PromotionCode",
                table: "Baskets",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Coupon_AmountOff",
                table: "Baskets");

            migrationBuilder.DropColumn(
                name: "Coupon_CouponId",
                table: "Baskets");

            migrationBuilder.DropColumn(
                name: "Coupon_Name",
                table: "Baskets");

            migrationBuilder.DropColumn(
                name: "Coupon_PercentOff",
                table: "Baskets");

            migrationBuilder.DropColumn(
                name: "Coupon_PromotionCode",
                table: "Baskets");
        }
    }
}
