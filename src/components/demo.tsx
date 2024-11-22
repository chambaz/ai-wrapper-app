'use client'

import React from 'react'

import { useCompletion } from 'ai/react'
import { IconSparkles, IconDatabase } from '@tabler/icons-react'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

enum DemoState {
  DEFAULT,
  LOADING_DB,
  LOADING_AI,
  ERROR,
  SUCCESS,
}

const Demo = () => {
  const { completion, complete } = useCompletion({
    api: '/api/completion',
  })
  const [demoState, setDemoState] = React.useState<DemoState>(DemoState.DEFAULT)
  const [testDbRows, setTestDbRows] = React.useState<
    {
      id: number
      created_at: string
    }[]
  >([])

  const getTestDbRows = React.useCallback(async () => {
    setDemoState(DemoState.LOADING_DB)
    const res = await fetch('/api/db')

    if (!res.ok) {
      console.error('Failed to fetch test DB rows', res)
      setDemoState(DemoState.ERROR)
      return
    }

    const jsonData = await res.json()

    setTestDbRows(jsonData.data)
    setDemoState(DemoState.SUCCESS)
  }, [])

  return (
    <div className="w-full container max-w-2xl flex flex-col justify-center items-center">
      {demoState === DemoState.ERROR ? (
        <p>Error fetching test DB rows</p>
      ) : demoState === DemoState.DEFAULT ? (
        <Button onClick={getTestDbRows} className="w-full">
          <IconDatabase size={16} /> Fetch DB rows
        </Button>
      ) : demoState === DemoState.LOADING_DB ? (
        <p className="text-sm text-muted-foreground italic">
          Fetching test DB rows...
        </p>
      ) : (
        <div className="flex flex-col gap-4 w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {testDbRows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.created_at}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button variant="secondary" size="sm" onClick={getTestDbRows}>
            Refresh rows
          </Button>
        </div>
      )}

      <div className="flex flex-col gap-4 w-full">
        <div className="px-4">{completion}</div>
        <Button
          disabled={demoState === DemoState.LOADING_AI}
          className="w-full"
          onClick={async () => {
            setDemoState(DemoState.LOADING_AI)
            await complete('Why is the sky blue?')
            setDemoState(DemoState.SUCCESS)
          }}
        >
          <IconSparkles size={16} />{' '}
          {demoState === DemoState.LOADING_AI ? 'Asking AI...' : 'Ask AI'}
        </Button>
      </div>
    </div>
  )
}

export { Demo }
