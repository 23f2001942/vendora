import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.76.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ProductData {
  name: string;
  description: string;
  category: string;
  base_price: number;
  wholesaler_price: number;
  stock_quantity: number;
  minimum_order_quantity: number;
}

const productsData: ProductData[] = [
  // Electronics
  { name: "Boat Earbuds", description: "Wireless bluetooth earbuds with premium sound quality", category: "electronics", base_price: 350, wholesaler_price: 250, stock_quantity: 100, minimum_order_quantity: 10 },
  { name: "USB Type-C Cable", description: "Fast charging 1.5m cable with data transfer", category: "electronics", base_price: 50, wholesaler_price: 35, stock_quantity: 500, minimum_order_quantity: 50 },
  { name: "Power Bank 10000mAh", description: "Portable charger with dual USB ports", category: "electronics", base_price: 650, wholesaler_price: 450, stock_quantity: 75, minimum_order_quantity: 5 },
  
  // Clothing
  { name: "Cotton T-Shirts (Plain)", description: "Round neck, assorted colors, comfortable fit", category: "clothing", base_price: 180, wholesaler_price: 120, stock_quantity: 300, minimum_order_quantity: 20 },
  { name: "Denim Jeans", description: "Classic fit, multiple sizes available", category: "clothing", base_price: 650, wholesaler_price: 450, stock_quantity: 150, minimum_order_quantity: 10 },
  { name: "Cotton Socks (Pack of 3)", description: "Ankle length, assorted colors", category: "clothing", base_price: 120, wholesaler_price: 80, stock_quantity: 400, minimum_order_quantity: 30 },
  
  // Food
  { name: "Parle-G Biscuits", description: "Family pack 500g, India's favorite biscuit", category: "food", base_price: 50, wholesaler_price: 35, stock_quantity: 800, minimum_order_quantity: 50 },
  
  // Home
  { name: "Steel Utensil Set", description: "5-piece cookware set, premium quality", category: "home", base_price: 1200, wholesaler_price: 850, stock_quantity: 50, minimum_order_quantity: 5 },
  { name: "LED Bulb 9W", description: "Energy saving white light, long lasting", category: "home", base_price: 65, wholesaler_price: 45, stock_quantity: 600, minimum_order_quantity: 50 },
  { name: "Plastic Storage Containers (Set)", description: "4-piece airtight containers for kitchen", category: "home", base_price: 260, wholesaler_price: 180, stock_quantity: 200, minimum_order_quantity: 20 },
  
  // Beauty
  { name: "Himalaya Face Wash", description: "Neem & turmeric 100ml, natural ingredients", category: "beauty", base_price: 95, wholesaler_price: 65, stock_quantity: 300, minimum_order_quantity: 25 },
  { name: "Hair Oil 200ml", description: "Coconut enriched, for healthy hair", category: "beauty", base_price: 125, wholesaler_price: 85, stock_quantity: 250, minimum_order_quantity: 20 },
  { name: "Soap Bar (Pack of 4)", description: "Glycerin soap assorted fragrances", category: "beauty", base_price: 140, wholesaler_price: 95, stock_quantity: 400, minimum_order_quantity: 30 },
  
  // Sports
  { name: "Yoga Mat", description: "Non-slip 6mm thick, perfect for workouts", category: "sports", base_price: 400, wholesaler_price: 280, stock_quantity: 100, minimum_order_quantity: 10 },
  { name: "Badminton Shuttlecock", description: "Pack of 10 feather shuttles, tournament quality", category: "sports", base_price: 220, wholesaler_price: 150, stock_quantity: 150, minimum_order_quantity: 15 },
  { name: "Sports Water Bottle", description: "1L BPA-free plastic, leak-proof", category: "sports", base_price: 140, wholesaler_price: 95, stock_quantity: 200, minimum_order_quantity: 20 },
  
  // Books
  { name: "Camlin Exam Pad", description: "70 GSM ruled sheets 100 pages, quality paper", category: "books", base_price: 80, wholesaler_price: 55, stock_quantity: 300, minimum_order_quantity: 40 },
  { name: "Story Books Collection", description: "Set of 5 children's books, colorful illustrations", category: "books", base_price: 350, wholesaler_price: 250, stock_quantity: 80, minimum_order_quantity: 10 },
  
  // Toys
  { name: "Building Blocks Set", description: "100-piece plastic blocks, educational toy", category: "toys", base_price: 450, wholesaler_price: 320, stock_quantity: 120, minimum_order_quantity: 10 },
  { name: "Toy Cars (Pack of 5)", description: "Die-cast metal cars, assorted models", category: "toys", base_price: 260, wholesaler_price: 180, stock_quantity: 150, minimum_order_quantity: 15 },
  { name: "Soft Plush Teddy Bear", description: "Medium size 30cm, soft and cuddly", category: "toys", base_price: 320, wholesaler_price: 220, stock_quantity: 100, minimum_order_quantity: 12 },
  
  // Other
  { name: "Stationery Kit", description: "Pens, pencils, erasers combo pack", category: "other", base_price: 140, wholesaler_price: 95, stock_quantity: 250, minimum_order_quantity: 25 },
  { name: "Cleaning Cloth (Pack of 10)", description: "Microfiber multipurpose cleaning cloths", category: "other", base_price: 175, wholesaler_price: 120, stock_quantity: 300, minimum_order_quantity: 30 },
  { name: "Phone Accessories Kit", description: "Screen guard, case, stand - complete kit", category: "other", base_price: 210, wholesaler_price: 145, stock_quantity: 200, minimum_order_quantity: 20 },
];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          persistSession: false,
        },
      }
    );

    const { userId } = await req.json();
    
    if (!userId) {
      throw new Error('User ID is required');
    }

    // Get wholesaler ID from user_id
    const { data: wholesalers, error: wholesalerError } = await supabaseClient
      .from('wholesalers')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (wholesalerError || !wholesalers) {
      throw new Error('Wholesaler not found for this user');
    }

    const wholesalerId = wholesalers.id;
    const insertedProducts = [];

    // Insert products one by one and link to wholesaler
    for (const productData of productsData) {
      // Insert product
      const { data: product, error: productError } = await supabaseClient
        .from('products')
        .insert({
          name: productData.name,
          description: productData.description,
          category: productData.category,
          base_price: productData.base_price,
        })
        .select()
        .single();

      if (productError) {
        console.error('Error inserting product:', productData.name, productError);
        continue;
      }

      // Link to wholesaler
      const { error: wholesalerProductError } = await supabaseClient
        .from('wholesaler_products')
        .insert({
          wholesaler_id: wholesalerId,
          product_id: product.id,
          price: productData.wholesaler_price,
          stock_quantity: productData.stock_quantity,
          minimum_order_quantity: productData.minimum_order_quantity,
          is_available: true,
        });

      if (wholesalerProductError) {
        console.error('Error linking product to wholesaler:', productData.name, wholesalerProductError);
        continue;
      }

      insertedProducts.push(product);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully inserted ${insertedProducts.length} products`,
        products: insertedProducts,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
