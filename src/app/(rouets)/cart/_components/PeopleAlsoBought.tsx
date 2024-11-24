"use client";

import { useEffect, useState } from "react";
import ProductCard from "../../category/_components/ProductCard";
import { Product } from "@/store/use-product-store";
import axios from "@/lib/axios";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";

const PeopleAlsoBought = () => {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get("/products/recommendations");
        setRecommendations(res.data.products);
      } catch {
        toast.error("An error while fetching recommendations");
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecommendations();
  }, []);

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-semibold text-emerald-400">
        People also bought
      </h3>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <div className="flex items-center justify-start">
            <Loader className="size-5 animate-spin mr-2" />
            loading...
          </div>
        ) : (
          recommendations.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </div>
  );
};

export default PeopleAlsoBought;
