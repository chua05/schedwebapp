"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrashIcon, CalendarIcon, ClockIcon } from "lucide-react"
import type { Event } from "@/app/page"

interface EventListProps {
  events: Event[]
  onDeleteEvent: (id: string) => void
}

export function EventList({ events, onDeleteEvent }: EventListProps) {
  const sortedEvents = [...events].sort((a, b) => a.date.getTime() - b.date.getTime())

  const groupEventsByMonth = () => {
    const grouped: { [key: string]: Event[] } = {}

    sortedEvents.forEach((event) => {
      const monthYear = event.date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
      if (!grouped[monthYear]) {
        grouped[monthYear] = []
      }
      grouped[monthYear].push(event)
    })

    return grouped
  }

  const groupedEvents = groupEventsByMonth()

  if (events.length === 0) {
    return (
      <Card className="p-12 text-center shadow-lg border-border/50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
            <CalendarIcon className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-1">No events yet</h3>
            <p className="text-sm text-muted-foreground">Create your first event to get started</p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedEvents).map(([monthYear, monthEvents]) => (
        <div key={monthYear}>
          <h3 className="text-lg font-semibold mb-3 text-primary">{monthYear}</h3>
          <div className="space-y-3">
            {monthEvents.map((event) => (
              <Card key={event.id} className="p-4 shadow-sm border-border/50 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  {/* Date Badge */}
                  <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-gradient-to-br from-primary to-accent flex flex-col items-center justify-center text-primary-foreground">
                    <span className="text-xs font-medium">
                      {event.date.toLocaleDateString("en-US", {
                        month: "short",
                      })}
                    </span>
                    <span className="text-2xl font-bold">{event.date.getDate()}</span>
                  </div>

                  {/* Event Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-lg mb-1">{event.title}</h4>
                    {event.description && <p className="text-sm text-muted-foreground mb-2">{event.description}</p>}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3" />
                        <span>
                          {event.date.toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      {event.time && (
                        <div className="flex items-center gap-1">
                          <ClockIcon className="h-3 w-3" />
                          <span>{event.time}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Delete Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteEvent(event.id)}
                    className="flex-shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
