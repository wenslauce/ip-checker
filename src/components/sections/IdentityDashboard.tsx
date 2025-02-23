import { Battery, Box, Cpu, Database, Gauge, MapPin, Monitor, Network, Wifi } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useSystemInfo } from "@/lib/system-info"
import { motion } from "framer-motion"

const InfoItem = ({ label, value }: { label: string; value: string | number | boolean }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <p className="flex items-center justify-between">
          <span className="font-medium">{label}:</span>
          <span className="text-white/80">{String(value)}</span>
        </p>
      </TooltipTrigger>
      <TooltipContent>
        <p>Click to copy</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
)

const CardTitle = ({ icon: Icon, title, color }: { icon: any; title: string; color: string }) => (
  <motion.h3 
    className="text-lg font-semibold mb-4 flex items-center gap-2"
    initial={{ x: -20, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <Icon className={`w-5 h-5 ${color}`} />
    {title}
  </motion.h3>
)

export function IdentityDashboard() {
  const systemInfo = useSystemInfo()

  if (!systemInfo) {
    return (
      <div className="container mx-auto p-6">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Loading system information...
        </motion.div>
      </div>
    )
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <motion.div 
      className="container mx-auto p-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Browser Information */}
        <Card className="p-6">
          <CardTitle icon={Monitor} title="Browser" color="text-blue-400" />
          <div className="space-y-2 text-sm">
            <InfoItem label="Name" value={systemInfo.browser.name} />
            <InfoItem label="Version" value={systemInfo.browser.version} />
            <InfoItem label="Platform" value={systemInfo.browser.platform} />
            <InfoItem label="Language" value={systemInfo.browser.language} />
            <InfoItem label="Online" value={systemInfo.browser.online ? 'Yes' : 'No'} />
            <InfoItem label="Cookies" value={systemInfo.browser.cookiesEnabled ? 'Enabled' : 'Disabled'} />
          </div>
        </Card>

        {/* Location Information */}
        <Card className="p-6">
          <CardTitle icon={MapPin} title="Location" color="text-green-400" />
          <div className="space-y-2 text-sm">
            <InfoItem label="Country" value={systemInfo.location.country} />
            <InfoItem label="City" value={systemInfo.location.city} />
            <InfoItem label="Region" value={systemInfo.location.region} />
            {systemInfo.location.latitude && systemInfo.location.longitude && (
              <InfoItem 
                label="Coordinates" 
                value={`${systemInfo.location.latitude}, ${systemInfo.location.longitude}`} 
              />
            )}
          </div>
        </Card>

        {/* IP Address Information */}
        <Card className="p-6">
          <CardTitle icon={Network} title="IP Address" color="text-purple-400" />
          <div className="space-y-2 text-sm">
            <InfoItem label="IP" value={systemInfo.ip.address} />
            <InfoItem label="Organization" value={systemInfo.ip.organization} />
            <InfoItem label="AS Number" value={systemInfo.ip.asNumber} />
            <div className="mt-2">
              <p className="font-medium mb-2">Security:</p>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(systemInfo.ip.security).map(([key, value]) => (
                  <div 
                    key={key}
                    className={`p-2 rounded-lg text-center ${
                      value ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'
                    }`}
                  >
                    {key}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Hardware Information */}
        <Card className="p-6">
          <CardTitle icon={Cpu} title="Hardware" color="text-red-400" />
          <div className="space-y-2 text-sm">
            <InfoItem label="Memory" value={formatBytes(systemInfo.hardware.memory.total)} />
            <InfoItem label="CPU Cores" value={systemInfo.hardware.cores} />
            <InfoItem label="GPU" value={systemInfo.hardware.gpu} />
          </div>
        </Card>

        {/* Software Information */}
        <Card className="p-6">
          <CardTitle icon={Box} title="Software" color="text-yellow-400" />
          <div className="space-y-2 text-sm">
            <div>
              <p className="font-medium mb-2">Plugins:</p>
              <div className="space-y-1">
                {systemInfo.software.plugins.map((plugin, index) => (
                  <motion.div
                    key={index}
                    className="bg-white/5 p-2 rounded-lg"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {plugin}
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <p className="font-medium mb-2">Permissions:</p>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(systemInfo.software.permissions).map(([key, value], index) => (
                  <motion.div
                    key={key}
                    className="bg-white/5 p-2 rounded-lg text-center"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {key}: {String(value)}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Battery Information */}
        {systemInfo.hardware.battery && (
          <Card className="p-6">
            <CardTitle icon={Battery} title="Battery" color="text-orange-400" />
            <div className="space-y-4 text-sm">
              <div>
                <InfoItem 
                  label="Level" 
                  value={`${systemInfo.hardware.battery.level.toFixed(0)}%`} 
                />
                <Progress 
                  value={systemInfo.hardware.battery.level * 100} 
                  className="mt-2"
                />
              </div>
              <InfoItem 
                label="Charging" 
                value={systemInfo.hardware.battery.charging ? 'Yes' : 'No'} 
              />
              {systemInfo.hardware.battery.charging ? (
                <InfoItem 
                  label="Time until full" 
                  value={`${Math.round(systemInfo.hardware.battery.chargingTime / 60)} minutes`} 
                />
              ) : (
                <InfoItem 
                  label="Time remaining" 
                  value={`${Math.round(systemInfo.hardware.battery.dischargingTime / 60)} minutes`} 
                />
              )}
            </div>
          </Card>
        )}

        {/* Network Information */}
        <Card className="p-6">
          <CardTitle icon={Wifi} title="Network" color="text-indigo-400" />
          <div className="space-y-2 text-sm">
            <InfoItem label="Type" value={systemInfo.network.type} />
            <InfoItem label="Effective Type" value={systemInfo.network.effectiveType} />
            <InfoItem label="Downlink" value={`${systemInfo.network.downlink} Mbps`} />
            <InfoItem label="RTT" value={`${systemInfo.network.rtt}ms`} />
            <InfoItem 
              label="Save Data" 
              value={systemInfo.network.saveData ? 'Enabled' : 'Disabled'} 
            />
          </div>
        </Card>

        {/* Storage Information */}
        {systemInfo.storage && (
          <Card className="p-6">
            <CardTitle icon={Database} title="Storage" color="text-pink-400" />
            <div className="space-y-4 text-sm">
              <InfoItem label="Total" value={formatBytes(systemInfo.storage.quota)} />
              <InfoItem label="Used" value={formatBytes(systemInfo.storage.usage)} />
              <InfoItem label="Available" value={formatBytes(systemInfo.storage.available)} />
              <div>
                <p className="text-sm text-white/60 mb-2">Usage</p>
                <Progress 
                  value={(systemInfo.storage.usage / systemInfo.storage.quota) * 100} 
                />
              </div>
            </div>
          </Card>
        )}

        {/* Performance Information */}
        <Card className="p-6">
          <CardTitle icon={Gauge} title="Performance" color="text-cyan-400" />
          <div className="space-y-2 text-sm">
            <InfoItem 
              label="Navigation Type" 
              value={systemInfo.performance.navigation.type} 
            />
            <InfoItem 
              label="Load Time" 
              value={`${systemInfo.performance.timing.loadTime}ms`} 
            />
            <InfoItem 
              label="DOM Interactive" 
              value={`${systemInfo.performance.timing.domInteractive}ms`} 
            />
            {systemInfo.performance.memory && (
              <div className="space-y-2 mt-4">
                <InfoItem 
                  label="JS Heap Limit" 
                  value={formatBytes(systemInfo.performance.memory.jsHeapSizeLimit)} 
                />
                <InfoItem 
                  label="Total JS Heap" 
                  value={formatBytes(systemInfo.performance.memory.totalJSHeapSize)} 
                />
                <InfoItem 
                  label="Used JS Heap" 
                  value={formatBytes(systemInfo.performance.memory.usedJSHeapSize)} 
                />
                <Progress 
                  value={(systemInfo.performance.memory.usedJSHeapSize / systemInfo.performance.memory.jsHeapSizeLimit) * 100} 
                  className="mt-2"
                />
              </div>
            )}
          </div>
        </Card>
      </div>
    </motion.div>
  )
}
