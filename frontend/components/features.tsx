import { MessageSquare, Clock, BarChart4, Bell, Shield, Smartphone } from "lucide-react"

export function Features() {
  const features = [
    {
      name: "Easy Submission",
      description: "Submit complaints with our intuitive, step-by-step form process.",
      icon: MessageSquare,
    },
    {
      name: "Real-time Tracking",
      description: "Track the status of your complaints in real-time with detailed updates.",
      icon: Clock,
    },
    {
      name: "Categorized Reporting",
      description: "Complaints are automatically categorized and routed to the right department.",
      icon: BarChart4,
    },
    {
      name: "Instant Notifications",
      description: "Receive notifications when there are updates to your complaints.",
      icon: Bell,
    },
    {
      name: "Secure & Private",
      description: "Your personal information is protected with enterprise-grade security.",
      icon: Shield,
    },
    {
      name: "Mobile Friendly",
      description: "Access the platform from any device with our responsive design.",
      icon: Smartphone,
    },
  ]

  return (
    <div className="py-24 sm:py-32 bg-muted/50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">Better Experience</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Everything you need to be heard</p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Our platform is designed to make the complaint process as smooth and transparent as possible, ensuring your
            concerns are addressed efficiently.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}
