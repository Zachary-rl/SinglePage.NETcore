namespace WebApplication1.Migrations
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;
    using WebApplication1.Models;

    internal sealed class Configuration : DbMigrationsConfiguration<WebApplication1.Models.WebApplication1Context>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(WebApplication1.Models.WebApplication1Context context)
        {
            context.ShoppingLists.AddOrUpdate(
                

                new ShoppingList
                {
                    Name = "Groceries",
                    Items =
                    {
                        new Item {Name="Milk" },
                        new Item {Name="Steak" },
                        new Item {Name="Eggs" },
                    }
                },
                new ShoppingList
                {
                    Name = "Hardware"
                }
                );
        }
    }
}
