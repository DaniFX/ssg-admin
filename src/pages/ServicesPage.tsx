import { useEffect, useState } from 'react'
import { servicesApi, type Service } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Server, 
  RefreshCw, 
  Trash2, 
  Plus,
  X,
  Loader2,
  Edit2,
  Play,
  Square,
  Repeat,
  Zap,
  Settings
} from 'lucide-react'

export function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [statusRefreshInterval, setStatusRefreshInterval] = useState<NodeJS.Timeout | null>(null)
  
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    type: '',
    version: '',
    endpoint: '',
  })

  const fetchServices = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await servicesApi.list()
      setServices(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch services')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServices()
    
    // Start periodic status refresh (every 30 seconds)
    const interval = setInterval(() => {
      refreshServiceStatuses()
    }, 30000)
    setStatusRefreshInterval(interval)
    
    return () => {
      if (statusRefreshInterval) {
        clearInterval(statusRefreshInterval)
      }
    }
  }, [])

  const resetForm = () => {
    setFormData({ id: '', name: '', description: '', type: '', version: '', endpoint: '' })
    setIsCreating(false)
    setEditingService(null)
  }

  const handleCreate = () => {
    resetForm()
    setIsCreating(true)
  }

  const handleEdit = (service: Service) => {
    setFormData({
      id: service.id,
      name: service.name,
      description: service.description,
      type: service.type,
      version: service.version,
      endpoint: service.endpoint,
    })
    setEditingService(service)
    setIsCreating(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (editingService) {
        await servicesApi.update(editingService.id, formData)
      } else {
        await servicesApi.create(formData)
      }
      
      await fetchServices()
      resetForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save service')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (serviceId: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo servizio?')) return
    
    setDeleting(serviceId)
    try {
      await servicesApi.delete(serviceId)
      await fetchServices()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete service')
    } finally {
      setDeleting(null)
    }
  }

  const handleStart = async (serviceId: string) => {
    try {
      const updatedService = await servicesApi.start(serviceId)
      // Update the service in the list
      setServices(prev => prev.map(service => 
        service.id === serviceId ? { ...service, status: updatedService.status } : service
      ))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start service')
    }
  }

  const handleStop = async (serviceId: string) => {
    try {
      const updatedService = await servicesApi.stop(serviceId)
      // Update the service in the list
      setServices(prev => prev.map(service => 
        service.id === serviceId ? { ...service, status: updatedService.status } : service
      ))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to stop service')
    }
  }

  const handleRestart = async (serviceId: string) => {
    try {
      const updatedService = await servicesApi.restart(serviceId)
      // Update the service in the list
      setServices(prev => prev.map(service => 
        service.id === serviceId ? { ...service, status: updatedService.status } : service
      ))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to restart service')
    }
  }

  const refreshServiceStatuses = async () => {
    try {
      const servicesWithStatus = await Promise.all(
        services.map(async (service) => {
          const { status } = await servicesApi.getStatus(service.id)
          return { ...service, status }
        })
      )
      setServices(servicesWithStatus)
    } catch (err) {
      console.warn('Failed to refresh service statuses:', err)
      // Don't set error here to avoid disrupting UI with frequent status check failures
    }
  }

  const handleConfig = async (serviceId: string) => {
    try {
      const config = await servicesApi.getConfig(serviceId)
      // Open a modal or navigate to config page
      alert(JSON.stringify(config, null, 2))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get service configuration')
    }
  }

  if (loading && services.length === 0) {
    return (
      <div className="p-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <Server className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Gestione Servizi</h1>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={fetchServices} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Aggiorna
          </Button>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Nuovo Servizio
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Card key={service.id}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">{service.name}</CardTitle>
              <div className="flex space-x-1">
                <Button variant="ghost" size="sm" onClick={() => handleEdit(service)}>
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleDelete(service.id)}
                  disabled={deleting === service.id}
                >
                  {deleting === service.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4 text-red-500" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleConfig(service.id)}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className={`h-3 w-3 rounded-full ${
                    service.status === 'running' ? 'bg-green-500' :
                    service.status === 'stopped' ? 'bg-red-500' :
                    service.status === 'error' ? 'bg-orange-500' :
                    'bg-gray-500'
                  }`}></div>
                  <span className="text-xs text-gray-600">{service.status}</span>
                </div>
                
                <p className="text-sm text-gray-500 mb-1">
                  {service.description || 'Nessuna descrizione'}
                </p>
                
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {service.type}
                  </span>
                  <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">
                    v{service.version}
                  </span>
                </div>
                
                <p className="text-xs text-gray-400 break-all">
                  {service.endpoint}
                </p>
                
                <p className="text-xs text-gray-400">
                  ID: {service.id}
                </p>
                
                {service.createdAt && (
                  <p className="text-xs text-gray-400">
                    Creato: {new Date(service.createdAt).toLocaleDateString('it-IT')}
                  </p>
                )}
                
                {service.updatedAt && (
                  <p className="text-xs text-gray-400">
                    Aggiornato: {new Date(service.updatedAt).toLocaleDateString('it-IT')}
                  </p>
                )}
              </div>
              
              <div className="mt-4 pt-3 border-t border-gray-200 flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  size="xs" 
                  onClick={() => handleStart(service.id)}
                  disabled={service.status === 'running' || saving || deleting === service.id}
                >
                  {service.status === 'running' ? (
                    <>
                      <Spinner className="h-3 w-3 mr-1" />
                      Avvio...
                    </>
                  ) : (
                    <>
                      <Play className="h-3 w-3 mr-1" />
                      Avvia
                    </>
                  )}
                </Button>
                
                <Button 
                  variant="outline" 
                  size="xs" 
                  onClick={() => handleStop(service.id)}
                  disabled={service.status === 'stopped' || saving || deleting === service.id}
                >
                  {service.status === 'stopped' ? (
                    <>
                      <Spinner className="h-3 w-3 mr-1" />
                      Arresto...
                    </>
                  ) : (
                    <>
                      <Square className="h-3 w-3 mr-1" />
                      Ferma
                    </>
                  )}
                </Button>
                
                <Button 
                  variant="outline" 
                  size="xs" 
                  onClick={() => handleRestart(service.id)}
                  disabled={saving || deleting === service.id}
                >
                  <Repeat className="h-3 w-3 mr-1" />
                  Riavvia
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {services.length === 0 && !loading && (
        <Card>
          <CardContent className="py-8 text-center text-gray-500">
            Nessun servizio trovato. Aggiungine uno per iniziare.
          </CardContent>
        </Card>
      )}

      {isCreating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{editingService ? 'Modifica Servizio' : 'Nuovo Servizio'}</CardTitle>
              <Button variant="ghost" size="sm" onClick={resetForm}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="id">ID Servizio</Label>
                  <Input
                    id="id"
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    placeholder="es. auth-service, api-gateway"
                    disabled={!!editingService}
                  />
                </div>
                <div>
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="es. Auth Service"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Descrizione</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descrizione del servizio"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Tipo</Label>
                  <Select defaultValue="go" onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="go">Go</SelectItem>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="java">Java</SelectItem>
                      <SelectItem value="dotnet">DotNet</SelectItem>
                      <SelectItem value="dart">Dart</SelectItem>
                      <SelectItem value="nodejs">NodeJS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="version">Versione</Label>
                  <Input
                    id="version"
                    value={formData.version}
                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                    placeholder="es. 1.0.0"
                  />
                </div>
                <div>
                  <Label htmlFor="endpoint">Endpoint</Label>
                  <Input
                    id="endpoint"
                    value={formData.endpoint}
                    onChange={(e) => setFormData({ ...formData, endpoint: e.target.value })}
                    placeholder="es. http://localhost:8080/api"
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={resetForm}>
                    Annulla
                  </Button>
                  <Button 
                    onClick={handleSave} 
                    disabled={saving || !formData.id || !formData.name || !formData.type || !formData.version || !formData.endpoint}
                  >
                    {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Salva
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

// Simple spinner component for button states
function Spinner({ className }: { className?: string }) {
  return (
    <Loader2 className={`h-3 w-3 animate-spin ${className || ''}`} />
  )
}