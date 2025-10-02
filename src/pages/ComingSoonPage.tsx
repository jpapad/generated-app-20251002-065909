import { ChefHat } from 'lucide-react';
export function ComingSoonPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] text-center p-4">
      <ChefHat className="w-24 h-24 text-orange-400 mb-6 animate-bounce" />
      <h1 className="text-4xl font-bold font-display text-foreground mb-2">
        Coming Soon!
      </h1>
      <p className="text-lg text-muted-foreground max-w-md">
        This feature is still being perfected in our kitchen. We're working hard to bring it to you. Please check back later!
      </p>
    </div>
  );
}