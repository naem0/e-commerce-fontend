"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

export function Newsletter() {
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Success!",
        description: "You have been subscribed to our newsletter.",
      })
      setEmail("")
      setIsLoading(false)
    }, 1000)

    // In a real app, you would make an API call:
    // try {
    //   const response = await fetch('/api/newsletter', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ email }),
    //   });
    //   const data = await response.json();
    //   if (data.success) {
    //     toast({
    //       title: "Success!",
    //       description: "You have been subscribed to our newsletter.",
    //     });
    //     setEmail("");
    //   } else {
    //     toast({
    //       title: "Error",
    //       description: data.message || "Something went wrong. Please try again.",
    //       variant: "destructive",
    //     });
    //   }
    // } catch (error) {
    //   toast({
    //     title: "Error",
    //     description: "Something went wrong. Please try again.",
    //     variant: "destructive",
    //   });
    // } finally {
    //   setIsLoading(false);
    // }
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 border-t">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Stay Updated
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Subscribe to our newsletter to receive updates and exclusive offers.
            </p>
          </div>
          <div className="w-full max-w-md space-y-2">
            <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
            <p className="text-xs text-muted-foreground">
              By subscribing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
