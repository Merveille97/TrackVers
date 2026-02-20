import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RefreshCw, ArrowUpDown, Plus, Edit, UserPlus, CheckCircle, Shield } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import EditableCell from '@/components/EditableCell';

const AdminPage = () => {
  const [softwareList, setSoftwareList] = useState([]);
  const [editingRows, setEditingRows] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const [manualCheckStates, setManualCheckStates] = useState({});
  const [isGlobalChecking, setIsGlobalChecking] = useState(false);
  const { toast } = useToast();

  const [isAddSoftwareOpen, setIsAddSoftwareOpen] = useState(false);
  const [isEditSoftwareOpen, setIsEditSoftwareOpen] = useState(false);
  const [isCreateAdminOpen, setIsCreateAdminOpen] = useState(false);

  const [currentSoftware, setCurrentSoftware] = useState(null);
  const [adminForm, setAdminForm] = useState({ email: '', password: '', fullName: '' });
  const [softwareForm, setSoftwareForm] = useState({
    id: '',
    name: '',
    description: '',
    category: '',
    source_url: '',
    latest_version: '',
    icon: '',
    eol_date: '',
    end_of_support_date: '',
    end_of_maintenance_date: '',
  });

  const fetchSoftware = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('software').select('*').order('name', { ascending: true });
      if (error) {
        console.error('Error fetching software:', error);
      } else {
        setSoftwareList(data || []);
        const initialEdits = (data || []).reduce((acc, item) => {
          acc[item.id] = { ...item };
          return acc;
        }, {});
        setEditingRows(initialEdits);
      }
    } catch (err) {
      console.error("Fetch software crash:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSoftware();
  }, [fetchSoftware]);

  const handleInputChange = (id, field, value) => {
    setEditingRows(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleInlineSave = async (id) => {
    const updatedRow = editingRows[id];
    toast({ title: 'Saving...', description: `Updating ${updatedRow.name}...` });

    try {
      const { data, error } = await supabase
        .from('software')
        .update({
          latest_version: updatedRow.latest_version,
          source_url: updatedRow.source_url,
          last_updated: new Date().toISOString().split('T')[0] 
        })
        .eq('id', id)
        .select();

      if (error) {
        toast({ variant: 'destructive', title: 'Update failed', description: error.message });
        fetchSoftware();
      } else if (data && data.length > 0) {
        const savedRow = data[0];
        toast({ title: 'Success', description: `${savedRow.name} updated successfully.` });
        setSoftwareList(prev => prev.map(row => (row.id === id ? savedRow : row)));
        setEditingRows(prev => ({ ...prev, [id]: savedRow }));
      }
    } catch (err) {
      console.error("Inline save error:", err);
      toast({ variant: 'destructive', title: 'Error', description: 'An unexpected error occurred.' });
    }
  };

  const openAddSoftware = () => {
    setSoftwareForm({
      id: '',
      name: '',
      description: '',
      category: '',
      source_url: '',
      latest_version: '',
      icon: '',
      eol_date: '',
      end_of_support_date: '',
      end_of_maintenance_date: '',
    });
    setIsAddSoftwareOpen(true);
  };

  const openEditSoftware = (software) => {
    setCurrentSoftware(software);
    setSoftwareForm({
      id: software.id,
      name: software.name || '',
      description: software.description || '',
      category: software.category || '',
      source_url: software.source_url || '',
      latest_version: software.latest_version || '',
      icon: software.icon || '',
      eol_date: software.eol_date || '',
      end_of_support_date: software.end_of_support_date || '',
      end_of_maintenance_date: software.end_of_maintenance_date || '',
    });
    setIsEditSoftwareOpen(true);
  };

  const handleSoftwareSubmit = async (isEdit) => {
    try {
      const payload = { ...softwareForm };
      
      if (!isEdit && !payload.id) {
        payload.id = payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      }

      if (isEdit) {
        delete payload.id;
      }
      
      // Basic empty string handling - keep simple strings
      if (payload.eol_date && payload.eol_date.trim() === '') payload.eol_date = null;
      if (payload.end_of_support_date && payload.end_of_support_date.trim() === '') payload.end_of_support_date = null;
      if (payload.end_of_maintenance_date && payload.end_of_maintenance_date.trim() === '') payload.end_of_maintenance_date = null;

      let error;
      if (isEdit) {
        const { error: updateError } = await supabase
          .from('software')
          .update(payload)
          .eq('id', currentSoftware.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('software')
          .insert([payload]);
        error = insertError;
      }

      if (error) {
        toast({ variant: 'destructive', title: isEdit ? 'Update Failed' : 'Creation Failed', description: error.message });
      } else {
        toast({ title: 'Success', description: `Software updated successfully.` });
        setIsAddSoftwareOpen(false);
        setIsEditSoftwareOpen(false);
        fetchSoftware();
      }
    } catch (err) {
      console.error("Submit error:", err);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to submit form.' });
    }
  };

  const handleCreateAdmin = async () => {
    if (!adminForm.email || !adminForm.password) {
      toast({ variant: 'destructive', title: 'Error', description: 'Email and password are required.' });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('create-admin-user', {
        body: adminForm
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast({ title: 'Success', description: 'New admin user created successfully.' });
      setIsCreateAdminOpen(false);
      setAdminForm({ email: '', password: '', fullName: '' });
    } catch (err) {
      toast({ variant: 'destructive', title: 'Failed to create admin', description: err.message });
    }
  };

  const handleManualCheck = async (softwareId) => {
    setManualCheckStates(prev => ({ ...prev, [softwareId]: true }));
    toast({ title: 'Checking...', description: `Checking updates for ${softwareId}...` });
    
    try {
      const { error } = await supabase.functions.invoke('check-versions', {
        body: { softwareIds: [softwareId] },
      });
      if (error) throw error;
      
      toast({ title: 'Check Complete', description: `${softwareId} checked.` });
      await fetchSoftware();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Check failed', description: error.message });
    } finally {
      setManualCheckStates(prev => ({ ...prev, [softwareId]: false }));
    }
  };

  const handleCheckAllUpdates = async () => {
    setIsGlobalChecking(true);
    toast({ title: 'Global Check Started', description: 'Checking updates for ALL software.' });
    
    try {
      const allIds = softwareList.map(s => s.id);
      if (allIds.length === 0) {
        toast({ title: "No Software", description: "No software to check." });
        return;
      }

      const { error } = await supabase.functions.invoke('check-versions', {
        body: { softwareIds: allIds },
      });
      
      if (error) throw error;

      toast({ 
        title: 'Global Check Complete', 
        description: `Checked ${allIds.length} software entries.`,
        action: <CheckCircle className="h-5 w-5 text-green-500" />
      });
      await fetchSoftware();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Global check failed', description: error.message });
    } finally {
      setIsGlobalChecking(false);
    }
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown className="ml-2 h-4 w-4 opacity-30" />;
    }
    return sortConfig.direction === 'ascending' ? '▲' : '▼';
  };

  const sortedAndFilteredSoftware = useMemo(() => {
    let sortableItems = [...softwareList];
    
    if (searchTerm) {
      sortableItems = sortableItems.filter(item =>
        (item.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.id || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    sortableItems.sort((a, b) => {
      const valA = a[sortConfig.key] || '';
      const valB = b[sortConfig.key] || '';
      
      if (valA < valB) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (valA > valB) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

    return sortableItems;
  }, [softwareList, searchTerm, sortConfig]);

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Software Management</title>
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              Admin Dashboard
            </h1>
          </div>
          <div className="flex gap-2">
             <Button onClick={() => setIsCreateAdminOpen(true)} variant="outline">
              <UserPlus className="mr-2 h-4 w-4" />
              New Admin
            </Button>
            <Button onClick={openAddSoftware}>
              <Plus className="mr-2 h-4 w-4" />
              Add Software
            </Button>
            <Button onClick={handleCheckAllUpdates} disabled={isGlobalChecking} variant="secondary">
              <RefreshCw className={`mr-2 h-4 w-4 ${isGlobalChecking ? 'animate-spin' : ''}`} />
              Check All
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Input
            placeholder="Filter by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        {loading ? (
          <div className="text-center py-10">Loading software data...</div>
        ) : (
          <div className="overflow-x-auto rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead onClick={() => requestSort('name')} className="cursor-pointer">
                    <div className="flex items-center">Name {getSortIcon('name')}</div>
                  </TableHead>
                  <TableHead onClick={() => requestSort('category')} className="cursor-pointer">
                    <div className="flex items-center">Category {getSortIcon('category')}</div>
                  </TableHead>
                  <TableHead>Latest Ver.</TableHead>
                  <TableHead>Source URL</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedAndFilteredSoftware.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {item.name} 
                      <span className="text-xs text-gray-400 block font-mono">{item.id}</span>
                    </TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>
                      <EditableCell
                        value={editingRows[item.id]?.latest_version || ''}
                        onChange={(value) => handleInputChange(item.id, 'latest_version', value)}
                      />
                    </TableCell>
                    <TableCell className="max-w-[200px]">
                      <EditableCell
                        value={editingRows[item.id]?.source_url || ''}
                        onChange={(value) => handleInputChange(item.id, 'source_url', value)}
                        isTextArea={true}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button size="icon" variant="ghost" onClick={() => handleInlineSave(item.id)} title="Quick Save">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => openEditSoftware(item)} title="Full Edit">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => handleManualCheck(item.id)} disabled={manualCheckStates[item.id]} title="Check Updates">
                          <RefreshCw className={`h-4 w-4 ${manualCheckStates[item.id] ? 'animate-spin' : ''}`} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Add Software Dialog */}
        <Dialog open={isAddSoftwareOpen} onOpenChange={setIsAddSoftwareOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Software</DialogTitle>
              <DialogDescription>Add a new software entry to track.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" value={softwareForm.name} onChange={(e) => setSoftwareForm({...softwareForm, name: e.target.value})} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="id" className="text-right">ID (Slug)</Label>
                <Input id="id" placeholder="auto-generated if empty" value={softwareForm.id} onChange={(e) => setSoftwareForm({...softwareForm, id: e.target.value})} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">Category</Label>
                <Input id="category" value={softwareForm.category} onChange={(e) => setSoftwareForm({...softwareForm, category: e.target.value})} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="source_url" className="text-right">Source URL</Label>
                <Input id="source_url" value={softwareForm.source_url} onChange={(e) => setSoftwareForm({...softwareForm, source_url: e.target.value})} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="eol_date" className="text-right">EOL Date</Label>
                <Input 
                  id="eol_date" 
                  type="date"
                  value={softwareForm.eol_date || ''} 
                  onChange={(e) => setSoftwareForm({...softwareForm, eol_date: e.target.value})} 
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="end_of_support_date" className="text-right">Support Ends</Label>
                <Input 
                  id="end_of_support_date" 
                  type="date"
                  value={softwareForm.end_of_support_date || ''} 
                  onChange={(e) => setSoftwareForm({...softwareForm, end_of_support_date: e.target.value})} 
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="end_of_maintenance_date" className="text-right">Maint. Ends</Label>
                <Input 
                  id="end_of_maintenance_date" 
                  type="date"
                  value={softwareForm.end_of_maintenance_date || ''} 
                  onChange={(e) => setSoftwareForm({...softwareForm, end_of_maintenance_date: e.target.value})} 
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Textarea id="description" value={softwareForm.description} onChange={(e) => setSoftwareForm({...softwareForm, description: e.target.value})} className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddSoftwareOpen(false)}>Cancel</Button>
              <Button onClick={() => handleSoftwareSubmit(false)}>Add Software</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Software Dialog */}
        <Dialog open={isEditSoftwareOpen} onOpenChange={setIsEditSoftwareOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Software</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">Name</Label>
                <Input id="edit-name" value={softwareForm.name} onChange={(e) => setSoftwareForm({...softwareForm, name: e.target.value})} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-category" className="text-right">Category</Label>
                <Input id="edit-category" value={softwareForm.category} onChange={(e) => setSoftwareForm({...softwareForm, category: e.target.value})} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-source_url" className="text-right">Source URL</Label>
                <Input id="edit-source_url" value={softwareForm.source_url} onChange={(e) => setSoftwareForm({...softwareForm, source_url: e.target.value})} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-latest_version" className="text-right">Latest Ver.</Label>
                <Input id="edit-latest_version" value={softwareForm.latest_version} onChange={(e) => setSoftwareForm({...softwareForm, latest_version: e.target.value})} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-eol_date" className="text-right">EOL Date</Label>
                <Input 
                  id="edit-eol_date" 
                  type="date"
                  value={softwareForm.eol_date || ''} 
                  onChange={(e) => setSoftwareForm({...softwareForm, eol_date: e.target.value})} 
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-end_of_support_date" className="text-right">Support Ends</Label>
                <Input 
                  id="edit-end_of_support_date" 
                  type="date"
                  value={softwareForm.end_of_support_date || ''} 
                  onChange={(e) => setSoftwareForm({...softwareForm, end_of_support_date: e.target.value})} 
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-end_of_maintenance_date" className="text-right">Maint. Ends</Label>
                <Input 
                  id="edit-end_of_maintenance_date" 
                  type="date"
                  value={softwareForm.end_of_maintenance_date || ''} 
                  onChange={(e) => setSoftwareForm({...softwareForm, end_of_maintenance_date: e.target.value})} 
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-description" className="text-right">Description</Label>
                <Textarea id="edit-description" value={softwareForm.description} onChange={(e) => setSoftwareForm({...softwareForm, description: e.target.value})} className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditSoftwareOpen(false)}>Cancel</Button>
              <Button onClick={() => handleSoftwareSubmit(true)}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Create Admin Dialog */}
        <Dialog open={isCreateAdminOpen} onOpenChange={setIsCreateAdminOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Admin</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="admin-name" className="text-right">Full Name</Label>
                <Input id="admin-name" value={adminForm.fullName} onChange={(e) => setAdminForm({...adminForm, fullName: e.target.value})} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="admin-email" className="text-right">Email</Label>
                <Input id="admin-email" type="email" value={adminForm.email} onChange={(e) => setAdminForm({...adminForm, email: e.target.value})} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="admin-password" className="text-right">Password</Label>
                <Input id="admin-password" type="password" value={adminForm.password} onChange={(e) => setAdminForm({...adminForm, password: e.target.value})} className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateAdminOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateAdmin}>Create Admin</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </>
  );
};

export default AdminPage;