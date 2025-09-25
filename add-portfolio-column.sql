-- Add portfolio_images column to vendors table
-- Run this in your Supabase SQL Editor

ALTER TABLE public.vendors 
ADD COLUMN IF NOT EXISTS portfolio_images TEXT[] DEFAULT '{}';

-- Update existing vendors with portfolio images
UPDATE public.vendors 
SET portfolio_images = ARRAY[
  'https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/rajpurohit_decorator_and_caterers/portfolio_1.webp',
  'https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/rajpurohit_decorator_and_caterers/portfolio_2.webp',
  'https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/rajpurohit_decorator_and_caterers/portfolio_3.webp',
  'https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/rajpurohit_decorator_and_caterers/portfolio_4.webp',
  'https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/rajpurohit_decorator_and_caterers/portfolio_5.webp'
]
WHERE name = 'Rajpurohit Decorator and caterers';

UPDATE public.vendors 
SET portfolio_images = ARRAY[
  'https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/la_fiesta_decors/portfolio_1.webp',
  'https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/la_fiesta_decors/portfolio_2.webp',
  'https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/la_fiesta_decors/portfolio_3.webp',
  'https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/la_fiesta_decors/portfolio_4.webp',
  'https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/la_fiesta_decors/portfolio_5.webp',
  'https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/la_fiesta_decors/portfolio_6.webp',
  'https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/la_fiesta_decors/portfolio_7.webp',
  'https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/la_fiesta_decors/portfolio_8.webp',
  'https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/la_fiesta_decors/portfolio_9.webp'
]
WHERE name = 'La Fiesta Decors';

UPDATE public.vendors 
SET portfolio_images = ARRAY[
  'https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/rr_decorators/portfolio_1.webp',
  'https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/rr_decorators/portfolio_2.webp',
  'https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/rr_decorators/portfolio_3.webp'
]
WHERE name = 'R R decorators';

-- Verify the updates
SELECT 
  id,
  name,
  array_length(portfolio_images, 1) as portfolio_count,
  portfolio_images
FROM public.vendors 
ORDER BY created_at;
