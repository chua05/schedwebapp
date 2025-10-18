"use client"

import type React from "react"
import { useEffect, useState } from "react"
import AddEventDialogDefault from "@/components/ui/add-event-dialog"
import * as AddEventDialogModule from "@/components/ui/add-event-dialog"
import { Button } from "@/components/ui/button"
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon, CalendarIcon } from "lucide-react"

function Calendar({
  events,
  onDateSelect,
}: {
  events: { id: string; title: string; date: Date; description?: string; time?: string }[]
  onDateSelect: (date: Date) => void
}) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const today = new Date()

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const hasEventOnDate = (day: number) => {
    return events.some(
      (e) =>
        e.date.getDate() === day &&
        e.date.getMonth() === currentDate.getMonth() &&
        e.date.getFullYear() === currentDate.getFullYear(),
    )
  }

  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      today.getMonth() === currentDate.getMonth() &&
      today.getFullYear() === currentDate.getFullYear()
    )
  }

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i)

  const monthName = currentDate.toLocaleString("default", { month: "long", year: "numeric" })

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-black">{monthName}</h2>
        <div className="flex gap-2">
          <button
            onClick={handlePrevMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            type="button"
          >
            <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            type="button"
          >
            <ChevronRightIcon className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {emptyDays.map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}
        {days.map((day) => (
          <button
            key={day}
            onClick={() => {
              const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
              onDateSelect(selectedDate)
            }}
            className={`aspect-square rounded-xl font-semibold transition-all flex items-center justify-center text-sm ${
              isToday(day)
                ? "bg-purple-600 text-white shadow-md"
                : hasEventOnDate(day)
                  ? "bg-gray-50 border-2 border-purple-300 text-black"
                  : "bg-gray-50 border border-gray-200 text-gray-700 hover:border-purple-300"
            }`}
            type="button"
          >
            {day}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="flex gap-6 mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-600" />
          <span className="text-sm text-gray-600">Today</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-300" />
          <span className="text-sm text-gray-600">Has Events</span>
        </div>
      </div>
    </div>
  )
}

function ListView({
  events,
  onDeleteEvent,
}: {
  events: { id: string; title: string; date: Date; description?: string; time?: string }[]
  onDeleteEvent: (id: string) => void
}) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="bg-gray-100 rounded-full p-6 mb-4">
            <CalendarIcon className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-black mb-2">No events yet</h3>
          <p className="text-gray-600 text-center">Create your first event to get started</p>
        </div>
      ) : (
        <div className="space-y-4">
          {events
            .sort((a, b) => a.date.getTime() - b.date.getTime())
            .map((event) => (
              <div
                key={event.id}
                className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <h4 className="font-semibold text-black">{event.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{event.date.toLocaleDateString()}</p>
                  {event.time && <p className="text-sm text-gray-600">{event.time}</p>}
                  {event.description && <p className="text-sm text-gray-500 mt-2">{event.description}</p>}
                </div>
                <button
                  onClick={() => onDeleteEvent(event.id)}
                  className="ml-4 text-gray-400 hover:text-red-600 transition-colors"
                  type="button"
                >
                  ✕
                </button>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}

export interface Event {
  id: string
  title: string
  date: Date
  description?: string
  time?: string
}

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [view, setView] = useState<"calendar" | "list">("calendar")

  useEffect(() => {
    const savedEvents = localStorage.getItem("schedule-events")
    if (savedEvents) {
      const parsed = JSON.parse(savedEvents)
      setEvents(parsed.map((e: Event) => ({ ...e, date: new Date(e.date) })))
    }
  }, [])

  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem("schedule-events", JSON.stringify(events))
    } else {
      localStorage.removeItem("schedule-events")
    }
  }, [events])

  const addEvent = (event: Omit<Event, "id">) => {
    const newEvent = {
      ...event,
      id: crypto.randomUUID(),
    }
    setEvents([...events, newEvent])
  }

  const deleteEvent = (id: string) => {
    setEvents(events.filter((e) => e.id !== id))
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    setIsAddDialogOpen(true)
  }

  const AddEventDialogComp = ((AddEventDialogModule as any).AddEventDialog ??
    AddEventDialogDefault) as React.ComponentType<any>

  const upcomingEvents = events.filter((e) => e.date >= new Date()).sort((a, b) => a.date.getTime() - b.date.getTime())

  const thisMonthEvents = events.filter((e) => {
    const now = new Date()
    return e.date.getMonth() === now.getMonth() && e.date.getFullYear() === now.getFullYear()
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-purple-600 mb-2">Schedule</h1>
              <p className="text-gray-600 text-base">Manage your events and appointments</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setView("calendar")}
                variant={view === "calendar" ? "default" : "outline"}
                className={
                  view === "calendar"
                    ? "bg-purple-600 hover:bg-purple-700 text-white rounded-full px-6 font-medium"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50 rounded-full px-6 bg-white font-medium"
                }
                size="sm"
              >
                Calendar
              </Button>
              <Button
                onClick={() => setView("list")}
                variant={view === "list" ? "default" : "outline"}
                className={
                  view === "list"
                    ? "bg-purple-600 hover:bg-purple-700 text-white rounded-full px-6 font-medium"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50 rounded-full px-6 bg-white font-medium"
                }
                size="sm"
              >
                List
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {view === "calendar" ? (
            <Calendar events={events} onDateSelect={handleDateSelect} />
          ) : (
            <ListView events={events} onDeleteEvent={deleteEvent} />
          )}

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Create New Event Card */}
            <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-white mb-1">Create New Event</h2>
              <p className="text-purple-100 text-sm mb-6">Add a new event to your schedule</p>
              <Button
                onClick={() => {
                  setSelectedDate(undefined)
                  setIsAddDialogOpen(true)
                }}
                className="w-full bg-white text-purple-600 hover:bg-gray-50 font-semibold"
                size="lg"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Event
              </Button>
            </div>

            {/* Quick Stats Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-black mb-6">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Total Events</span>
                  <span className="text-3xl font-bold text-purple-600">{events.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">This Month</span>
                  <span className="text-3xl font-bold text-purple-600">{thisMonthEvents.length}</span>
                </div>
              </div>
            </div>

            {/* Upcoming Events Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-black mb-6">Upcoming Events</h3>
              <div className="space-y-4">
                {upcomingEvents.length === 0 ? (
                  <div className="text-gray-500 text-sm text-center py-4">No upcoming events</div>
                ) : (
                  upcomingEvents.slice(0, 3).map((event) => (
                    <div key={event.id} className="pb-4 border-b border-gray-100 last:border-b-0 last:pb-0">
                      <div className="font-semibold text-gray-900 text-sm">{event.title}</div>
                      <div className="text-xs text-gray-500 mt-1">{event.date.toLocaleDateString()}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <AddEventDialogComp
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAddEvent={addEvent}
        selectedDate={selectedDate}
      />
    </div>
  )
}
