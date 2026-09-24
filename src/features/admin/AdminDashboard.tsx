import { LogOut } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AddGuests } from '@/features/admin/AddGuests'
import { GuestbookTab } from '@/features/admin/GuestbookTab'
import { GuestTable } from '@/features/admin/GuestTable'
import { Stats } from '@/features/admin/Stats'
import { useGuests } from '@/hooks/useGuests'
import { computeStats } from '@/lib/guests'
import { signOut } from '@/services/admin'

export function AdminDashboard() {
  const guests = useGuests()

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <header className="flex items-center justify-between gap-4">
        <h1 className="font-serif text-3xl font-semibold text-ink">Quản trị thiệp cưới</h1>
        <Button
          variant="outline"
          onClick={() => signOut().catch((error) => toast.error(error.message))}
        >
          <LogOut aria-hidden="true" />
          Đăng xuất
        </Button>
      </header>

      {guests.isLoading && (
        <div className="h-64 animate-pulse rounded-xl bg-muted" aria-label="Đang tải" />
      )}
      {guests.isError && (
        <p role="alert" className="text-destructive">
          {guests.error.message}
        </p>
      )}
      {guests.data && (
        <>
          <Stats stats={computeStats(guests.data)} />
          <Tabs defaultValue="guests">
            <TabsList>
              <TabsTrigger value="guests">Khách mời</TabsTrigger>
              <TabsTrigger value="guestbook">Lời chúc</TabsTrigger>
            </TabsList>
            <TabsContent value="guests" className="space-y-4">
              <AddGuests />
              <GuestTable guests={guests.data} />
            </TabsContent>
            <TabsContent value="guestbook">
              <GuestbookTab />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
