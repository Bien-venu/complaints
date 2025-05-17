"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useDispatch } from "react-redux"
import { login } from "@/lib/features/auth/authSlice"
import { setCurrentRole, setAdminInfo } from "@/lib/features/roles/roleSlice"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  rememberMe: z.boolean().optional(),
})

export function LoginForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState<"citizen" | "admin">("citizen")
  const [adminType, setAdminType] = useState<"super" | "district" | "sector">("sector")
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnUrl = searchParams.get("returnUrl") || "/dashboard"
  const dispatch = useDispatch()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      if (activeTab === "citizen") {
        if (values.email === "demo@example.com" && values.password === "password") {
          dispatch(
            login({
              user: {
                id: "user-1",
                name: "Demo User",
                email: values.email,
                role: "citizen",
                district: "Kigali",
                sector: "Gasabo",
              },
              token: "demo-token-citizen",
            }),
          )

          dispatch(setCurrentRole("citizen"))
          dispatch(setAdminInfo(null))

          router.push("/dashboard")
        } else {
          toast({
            title: "Invalid credentials",
            description: "Please use the demo credentials: demo@example.com / password",
            variant: "destructive",
          })
        }
      } else {
        // Admin login
        if (values.email === "admin@example.gov" && values.password === "admin123") {
          let adminInfo = null

          if (adminType === "super") {
            adminInfo = {
              id: "admin-super",
              name: "Super Admin",
              role: "super",
            }
          } else if (adminType === "district") {
            adminInfo = {
              id: "admin-district",
              name: "District Admin",
              role: "district",
              district: "Kigali",
            }
          } else {
            adminInfo = {
              id: "admin-sector",
              name: "Sector Admin",
              role: "sector",
              district: "Kigali",
              sector: "Gasabo",
            }
          }

          dispatch(
            login({
              user: {
                id: adminInfo.id,
                name: adminInfo.name,
                email: values.email,
                role: adminInfo.role,
                district: adminInfo.district,
                sector: adminInfo.sector,
              },
              token: `demo-token-${adminType}`,
            }),
          )

          dispatch(setCurrentRole(adminType))
          dispatch(setAdminInfo(adminInfo))

          router.push("/dashboard")
        } else {
          toast({
            title: "Invalid admin credentials",
            description: "Please use the demo credentials: admin@example.gov / admin123",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      toast({
        title: "Error logging in",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <Tabs defaultValue="citizen" onValueChange={(value) => setActiveTab(value as "citizen" | "admin")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="citizen">Citizen</TabsTrigger>
          <TabsTrigger value="admin">Government Admin</TabsTrigger>
        </TabsList>
        <TabsContent value="citizen">
          <CardHeader>
            <CardTitle>Citizen Login</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="your.email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">Remember me</FormLabel>
                    </FormItem>
                  )}
                />
                <div className="text-sm">
                  <Link href="/auth/forgot-password" className="text-[#157037] hover:underline">
                    Forgot password?
                  </Link>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col">
                <Button type="submit" className="w-full bg-[#157037] hover:bg-[#157037]/90" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isSubmitting ? "Logging in..." : "Log in"}
                </Button>
                <div className="mt-4 text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link href="/auth/register" className="text-[#157037] hover:underline">
                    Sign up
                  </Link>
                </div>
                <div className="mt-2 text-center text-xs text-muted-foreground">
                  Demo credentials: demo@example.com / password
                </div>
              </CardFooter>
            </form>
          </Form>
        </TabsContent>
        <TabsContent value="admin">
          <CardHeader>
            <CardTitle>Government Admin Login</CardTitle>
            <CardDescription>Secure access for government officials</CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Admin Type</label>
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant={adminType === "sector" ? "default" : "outline"}
                      className={adminType === "sector" ? "bg-[#157037] hover:bg-[#157037]/90" : ""}
                      onClick={() => setAdminType("sector")}
                    >
                      Sector Admin
                    </Button>
                    <Button
                      type="button"
                      variant={adminType === "district" ? "default" : "outline"}
                      className={adminType === "district" ? "bg-[#157037] hover:bg-[#157037]/90" : ""}
                      onClick={() => setAdminType("district")}
                    >
                      District Admin
                    </Button>
                    <Button
                      type="button"
                      variant={adminType === "super" ? "default" : "outline"}
                      className={adminType === "super" ? "bg-[#157037] hover:bg-[#157037]/90" : ""}
                      onClick={() => setAdminType("super")}
                    >
                      Super Admin
                    </Button>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="admin@example.gov" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">Remember me</FormLabel>
                    </FormItem>
                  )}
                />
                <div className="text-sm">
                  <Link href="/auth/forgot-password" className="text-[#157037] hover:underline">
                    Forgot password?
                  </Link>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col">
                <Button type="submit" className="w-full bg-[#157037] hover:bg-[#157037]/90" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isSubmitting ? "Logging in..." : "Log in"}
                </Button>
                <div className="mt-2 text-center text-xs text-muted-foreground">
                  Demo credentials: admin@example.gov / admin123
                </div>
              </CardFooter>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
