export function Stats() {
  const stats = [
    { id: 1, name: "Complaints Resolved", value: "15,000+" },
    { id: 2, name: "Average Response Time", value: "24 hours" },
    { id: 3, name: "Citizen Satisfaction", value: "92%" },
    { id: 4, name: "Government Agencies", value: "50+" },
  ]

  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Trusted by citizens across the nation</h2>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">
              Our platform has helped thousands of citizens get their issues resolved efficiently.
            </p>
          </div>
          <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.id} className="flex flex-col bg-muted/50 p-8">
                <dt className="text-sm font-semibold leading-6 text-muted-foreground">{stat.name}</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}
