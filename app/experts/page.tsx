// pages/experts/pages.tsx
import { useEffect, useState } from 'react'
import { supabase } from '../../utils/supabaseClient'
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  Button,
  Spinner,
  Box,
  Text,
  useToast
} from '@chakra-ui/react'

export default function ExpertSpreadsheet() {
  const [experts, setExperts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [edited, setEdited] = useState<any>({})
  const toast = useToast()

  useEffect(() => {
    fetchExperts()
  }, [])

  async function fetchExperts() {
    setLoading(true)
    const { data, error } = await supabase.from('experts').select('*')
    if (error) console.error(error)
    else setExperts(data || [])
    setLoading(false)
  }

  const handleEdit = (id: string) => {
    setEditingId(id)
    const current = experts.find((e) => e.id === id)
    setEdited({ ...current })
  }

  const handleChange = (field: string, value: string) => {
    setEdited({ ...edited, [field]: value })
  }

  const saveChanges = async () => {
    const { error } = await supabase
      .from('experts')
      .update(edited)
      .eq('id', edited.id)
    if (error) {
      toast({ title: 'Error updating', description: error.message, status: 'error' })
    } else {
      toast({ title: 'Expert updated', status: 'success' })
      await fetchExperts()
    }
    setEditingId(null)
  }

  if (loading) return <Spinner />

  return (
    <Box p={8}>
      <Text fontSize="2xl" mb={4}>Expert Management</Text>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Location</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {experts.map((expert) => (
            <Tr key={expert.id}>
              <Td>
                {editingId === expert.id ? (
                  <Input
                    value={edited.expert_name || ''}
                    onChange={(e) => handleChange('expert_name', e.target.value)}
                  />
                ) : (
                  expert.expert_name
                )}
              </Td>
              <Td>
                {editingId === expert.id ? (
                  <Input
                    value={edited.expert_email || ''}
                    onChange={(e) => handleChange('expert_email', e.target.value)}
                  />
                ) : (
                  expert.expert_email
                )}
              </Td>
              <Td>
                {editingId === expert.id ? (
                  <Input
                    value={edited.location || ''}
                    onChange={(e) => handleChange('location', e.target.value)}
                  />
                ) : (
                  expert.location
                )}
              </Td>
              <Td>
                {editingId === expert.id ? (
                  <Button size="sm" colorScheme="green" onClick={saveChanges}>Save</Button>
                ) : (
                  <Button size="sm" onClick={() => handleEdit(expert.id)}>Edit</Button>
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  )
}