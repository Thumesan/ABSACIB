using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Absa_CIB.Model;

namespace Absa_CIB.Data
{
    public class Absa_CIBContext : DbContext
    {
        public Absa_CIBContext (DbContextOptions<Absa_CIBContext> options)
            : base(options)
        {
        }

        public DbSet<Absa_CIB.Model.Contact> Contact { get; set; }
    }
}
