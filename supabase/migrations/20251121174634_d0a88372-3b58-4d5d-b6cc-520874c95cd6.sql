-- Add public access policies for browsing products and retailers

-- Allow public to view available retailer products
CREATE POLICY "Public can view available retailer products"
ON retailer_products FOR SELECT
TO public
USING (is_available = true);

-- Allow public to view all products
CREATE POLICY "Public can view all products"
ON products FOR SELECT
TO public
USING (true);

-- Allow public to view active retailers
CREATE POLICY "Public can view active retailers"
ON retailers FOR SELECT
TO public
USING (is_active = true);