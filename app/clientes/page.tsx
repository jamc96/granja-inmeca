"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Users, Plus, Search, Edit, Trash2 } from "lucide-react"
import { TopNav } from "@/components/top-nav"

interface Cliente {
  id: number
  nombre: string
  contacto?: string
  esFrecuente: boolean
}

// Datos de ejemplo - en una app real vendrían de la base de datos
const clientesEjemplo: Cliente[] = [
  { id: 1, nombre: "Restaurante El Pescador", contacto: "555-0101", esFrecuente: true },
  { id: 2, nombre: "Mariscos La Costa", contacto: "555-0202", esFrecuente: true },
  { id: 3, nombre: "Pescadería Central", contacto: "555-0303", esFrecuente: false },
  { id: 4, nombre: "Cliente Ocasional", contacto: "", esFrecuente: false },
]

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>(clientesEjemplo)
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null)
  const [newCliente, setNewCliente] = useState({ nombre: "", contacto: "" })

  const filteredClientes = clientes.filter(cliente =>
    cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.contacto?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddCliente = () => {
    if (newCliente.nombre.trim()) {
      const cliente: Cliente = {
        id: Date.now(),
        nombre: newCliente.nombre.trim(),
        contacto: newCliente.contacto.trim() || undefined,
        esFrecuente: false
      }
      setClientes([...clientes, cliente])
      setNewCliente({ nombre: "", contacto: "" })
      setShowAddDialog(false)
    }
  }

  const handleEditCliente = () => {
    if (editingCliente && editingCliente.nombre.trim()) {
      setClientes(clientes.map(c => 
        c.id === editingCliente.id ? editingCliente : c
      ))
      setEditingCliente(null)
    }
  }

  const handleDeleteCliente = (id: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar este cliente?")) {
      setClientes(clientes.filter(c => c.id !== id))
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNav title="Gestión de Clientes" />
      
      <div className="p-4 space-y-6">
        <div className="flex items-center justify-between">
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Agregar Cliente
              </Button>
            </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Cliente</DialogTitle>
              <DialogDescription>
                Ingresa la información del nuevo cliente.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  value={newCliente.nombre}
                  onChange={(e) => setNewCliente({...newCliente, nombre: e.target.value})}
                  placeholder="Nombre del cliente"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contacto">Contacto (opcional)</Label>
                <Input
                  id="contacto"
                  value={newCliente.contacto}
                  onChange={(e) => setNewCliente({...newCliente, contacto: e.target.value})}
                  placeholder="Teléfono o email"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddCliente}>
                Agregar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Búsqueda */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar clientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabla de clientes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Clientes ({filteredClientes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredClientes.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClientes.map((cliente) => (
                    <TableRow key={cliente.id}>
                      <TableCell className="font-medium">
                        {cliente.nombre}
                      </TableCell>
                      <TableCell>
                        {cliente.contacto || "Sin contacto"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={cliente.esFrecuente ? "default" : "secondary"}>
                          {cliente.esFrecuente ? "Frecuente" : "Ocasional"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingCliente(cliente)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteCliente(cliente.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>
                {searchTerm ? "No se encontraron clientes" : "No hay clientes registrados"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de edición */}
      <Dialog open={!!editingCliente} onOpenChange={() => setEditingCliente(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
            <DialogDescription>
              Modifica la información del cliente.
            </DialogDescription>
          </DialogHeader>
          {editingCliente && (
            <>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-nombre">Nombre</Label>
                  <Input
                    id="edit-nombre"
                    value={editingCliente.nombre}
                    onChange={(e) => setEditingCliente({...editingCliente, nombre: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-contacto">Contacto</Label>
                  <Input
                    id="edit-contacto"
                    value={editingCliente.contacto || ""}
                    onChange={(e) => setEditingCliente({...editingCliente, contacto: e.target.value})}
                    placeholder="Teléfono o email"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditingCliente(null)}>
                  Cancelar
                </Button>
                <Button onClick={handleEditCliente}>
                  Guardar
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      </div>
    </div>
  )
} 