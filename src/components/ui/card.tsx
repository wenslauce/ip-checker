import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { forwardRef } from "react"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  variant?: "default" | "glass"
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, variant = "glass", ...props }, ref) => {
    const variants = {
      hidden: { opacity: 0, y: 20 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: {
          duration: 0.6,
          ease: "easeOut"
        }
      },
      hover: {
        scale: 1.02,
        transition: {
          duration: 0.2
        }
      }
    }

    const glassStyles = variant === "glass" ? 
      "bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border-white/20" :
      "bg-white/5 border-white/10"

    return (
      <AnimatePresence>
        <motion.div
          ref={ref}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          variants={variants}
          className={cn(
            "rounded-xl border shadow-xl",
            "transition-all duration-300 ease-in-out",
            glassStyles,
            className
          )}
          {...props}
        >
          <div className="relative overflow-hidden rounded-xl">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
              animate={{
                x: ["0%", "200%"],
              }}
              transition={{
                duration: 2,
                ease: "linear",
                repeat: Infinity,
              }}
            />
            {children}
          </div>
        </motion.div>
      </AnimatePresence>
    )
  }
)

Card.displayName = "Card"

export { Card }
