import { motion } from "framer-motion"
import { Card } from "../ui/card"
import { Sparkles } from "lucide-react"

export function Hero() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-900 to-rose-900">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1707343843437-caacff5cfa74')] opacity-10 mix-blend-overlay" />
      
      <div className="container mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm"
          >
            <Sparkles className="h-8 w-8 text-white" />
          </motion.div>
          
          <h1 className="mb-6 bg-gradient-to-r from-white to-white/60 bg-clip-text text-6xl font-bold text-transparent">
            Glass Morphism UI
          </h1>
          <p className="mx-auto mb-12 max-w-2xl text-lg text-white/80">
            A beautiful and modern interface built with React, Framer Motion, and Tailwind CSS
          </p>
          
          <div className="grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="text-white">
                <h3 className="mb-2 text-xl font-semibold">Feature {i}</h3>
                <p className="text-white/70">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
