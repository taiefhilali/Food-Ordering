import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { Separator } from "@/components/ui/separator";
import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { Product } from "@/types/product";
import ImageSection from "../manage-restaurant-form/ImageSection";

const formSchema = z.object({
  productName: z.string({
    required_error: "Product name is required",
  }),
  description: z.string({
    required_error: "Description is required",
  }),
  price: z.number().min(0, {
    message: "Price must be greater than or equal to 0",
  }),
  category: z.string({
    required_error: "Category is required",
  }),
  quantity: z.number().min(0, {
    message: "Quantity must be greater than or equal to 0",
  }),
  imageFile: z.instanceof(File, { message: "Image is required" }).optional(),
});

type ProductFormData = z.infer<typeof formSchema>;

type Props = {
  product?: Product;
  onSave: (productFormData: FormData) => void;
  isLoading: boolean;
};

const ManageProductForm = ({ onSave, isLoading, product }: Props) => {
  const form = useForm<ProductFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: 0,
    },
  });

  useEffect(() => {
    if (product) {
      form.reset(product);
    }
  }, [form, product]);

  const onSubmit: SubmitHandler<ProductFormData> = (formData) => {
    console.log("Form submitted with data:", formData);
    if (!formData) {
      console.error("Form data is undefined");
      return;
    }
  
    const formDataJson = new FormData();
  
    formDataJson.append("productName", formData.productName);
    formDataJson.append("description", formData.description);
    formDataJson.append("price", formData.price.toString());
    formDataJson.append("category", formData.category);
    formDataJson.append("quantity", formData.quantity.toString());
  
    if (formData.imageFile) {
      formDataJson.append("imageFile", formData.imageFile as File);
    }
  
    onSave(formDataJson);
  };

  return (
    <Form {...form}>
<form onSubmit={(e) => { e.preventDefault(); }}> {/* Remove any event handlers that prevent default form submission */}
        <div className="space-y-4">
          <label htmlFor="productName" className="font-medium">
            Product Name
          </label>
          <input
            type="text"
            id="productName"
            className="input"
            {...form.register("productName")}
          />
          
        </div>
        <div className="space-y-4">
          <label htmlFor="description" className="font-medium">
            Description
          </label>
          <textarea
            id="description"
            className="input"
            {...form.register("description")}
          />
        
        </div>
        <div className="space-y-4">
          <label htmlFor="price" className="font-medium">
            Price
          </label>
          <input
            type="number"
            id="price"
            className="input"
            {...form.register("price")}
          />
        
        </div>
        <div className="space-y-4">
          <label htmlFor="category" className="font-medium">
            Category
          </label>
          <input
            type="text"
            id="category"
            className="input"
            {...form.register("category")}
          />
          
        </div>
        <div className="space-y-4">
          <label htmlFor="quantity" className="font-medium">
            Quantity
          </label>
          <input
            type="number"
            id="quantity"
            className="input"
            {...form.register("quantity")}
          />
    
        </div>
        <Separator />
        <ImageSection />
        {isLoading ? <LoadingButton /> : <Button type="submit">Submit</Button>}
      </form>
    </Form>
  );
};

export default ManageProductForm;
