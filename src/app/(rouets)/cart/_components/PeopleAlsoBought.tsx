"use client";

import ProductCard from "../../category/_components/ProductCard";
import { Loader } from "lucide-react";
import { RecommendationProducts } from "@/types";
import { User } from "@prisma/client";

interface PeopleAlsoBoughtProps {
  recommendations: RecommendationProducts[];
  user: User;
}

const PeopleAlsoBought = ({ recommendations, user }: PeopleAlsoBoughtProps) => {
  return (
    <div className="mt-8">
      <h3 className="text-2xl font-semibold text-emerald-400">
        People also bought
      </h3>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {!recommendations ? (
          <div className="flex items-center justify-start">
            <Loader className="size-5 animate-spin mr-2" />
            loading...
          </div>
        ) : (
          recommendations.map((product) => (
            <ProductCard key={product.id} product={product} user={user} />
          ))
        )}
      </div>
    </div>
  );
};

export default PeopleAlsoBought;
