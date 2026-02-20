import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const SoftwareTable = ({ software }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'latest':
        return 'success';
      case 'update-available':
        return 'warning';
      case 'outdated':
        return 'destructive';
      default:
        return 'default';
    }
  };

  return (
    <div className="rounded-lg border shadow-lg overflow-hidden bg-white dark:bg-gray-900">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px] font-bold text-gray-800 dark:text-gray-200">Name</TableHead>
            <TableHead className="font-bold text-gray-800 dark:text-gray-200">Category</TableHead>
            <TableHead className="font-bold text-gray-800 dark:text-gray-200">Current Version</TableHead>
            <TableHead className="font-bold text-gray-800 dark:text-gray-200">Latest Version</TableHead>
            <TableHead className="font-bold text-gray-800 dark:text-gray-200">Status</TableHead>
            <TableHead className="font-bold text-gray-800 dark:text-gray-200">Last Updated</TableHead>
            <TableHead className="text-right font-bold text-gray-800 dark:text-gray-200">Last Checked</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {software.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium text-gray-700 dark:text-gray-300">{item.name}</TableCell>
              <TableCell className="text-gray-600 dark:text-gray-400 capitalize">{item.category}</TableCell>
              <TableCell className="text-gray-600 dark:text-gray-400">{item.current_version}</TableCell>
              <TableCell className="text-gray-600 dark:text-gray-400">{item.latest_version || 'N/A'}</TableCell>
              <TableCell>
                {item.status && (
                  <Badge variant={getStatusVariant(item.status)}>
                    {item.status.replace('-', ' ')}
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-gray-600 dark:text-gray-400">{formatDate(item.last_updated)}</TableCell>
              <TableCell className="text-right text-gray-600 dark:text-gray-400">{formatDateTime(item.last_checked)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SoftwareTable;