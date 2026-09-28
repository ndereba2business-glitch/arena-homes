import { useId, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, LoaderCircle, Minus, Plus } from 'lucide-react'
import { policies, site } from '@/config/site'
import { getRoom, rooms, type Room } from '@/data/rooms'
import {
  checkAvailability,
  isValidEmail,
  normalizeKenyanPhone,
  submitBooking,
  type AvailabilityResult,
  type BookingRequest,
  type BookingResponse,
} from '@/lib/booking'
import { addDays, formatDate, formatKsh, nightsBetween, plural, todayISO } from '@/lib/format'
import { stayLengths, suggestedMoveIn, type SearchState } from '@/lib/search'
import { waMessages, whatsappLink } from '@/lib/whatsapp'
import { WhatsAppIcon } from '@/components/ui/Brand'

type Step = 'dates' | 'details' | 'done'
type Kind = BookingRequest['kind']

const viewingSlots = ['Morning (9 – 12)', 'Midday (12 – 3)', 'Afternoon (3 – 5)']

/**
 * Reservation / viewing request.
 * - With `room`: the sticky panel on a room page ("Reserve this space").
 * - Without: the full booking page, with a room picker and a viewing option.
 * Talks only to src/lib/booking.ts, so a real backend drops in there.
 */
export default function ReservePanel({
  room: fixedRoom,
  initial,
  defaultKind = 'reservation',
}: {
  room?: Room
  initial: SearchState
  defaultKind?: Kind
}) {
  const uid = useId()
  const pickable = !fixedRoom
  const [kind, setKind] = useState<Kind>(defaultKind)
  const [slug, setSlug] = useState(fixedRoom?.slug ?? rooms.find((r) => r.type === initial.type)?.slug ?? '')
  const room = fixedRoom ?? getRoom(slug)
  const canShortStay = !room || Boolean(room.pricing.nightly)

  const [stay, setStay] = useState(initial.stay === 'short' && canShortStay ? 'short' : 'long')
  const [checkIn, setCheckIn] = useState(initial.checkIn)
  const [checkOut, setCheckOut] = useState(initial.checkOut)
  const [months, setMonths] = useState(initial.months)
  const [guests, setGuests] = useState(Math.min(initial.guests, room?.occupancy ?? 6))
  const [slot, setSlot] = useState(viewingSlots[0])

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [notes, setNotes] = useState('')

  const [step, setStep] = useState<Step>('dates')
  const [busy, setBusy] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [availability, setAvailability] = useState<AvailabilityResult | null>(null)
  const [result, setResult] = useState<BookingResponse | null>(null)
  const [failed, setFailed] = useState(false)
  const [submitted, setSubmitted] = useState<BookingRequest | null>(null)

  const today = todayISO()
  const maxGuests = room?.occupancy ?? 6
  const isViewing = kind === 'viewing'
  const short = stay === 'short' && !isViewing

  // ---- pricing estimate
  const nights = short && checkIn && checkOut ? nightsBetween(checkIn, checkOut) : 0
  const units = room?.pricing.per === 'bed' ? guests : 1
  const monthly = room ? room.pricing.monthly * units : 0
  const deposit = monthly * policies.depositMonths
  const nightlyTotal = room?.pricing.nightly ? room.pricing.nightly * nights : 0

  const pickRoom = (s: string) => {
    setSlug(s)
    const r = getRoom(s)
    if (r) {
      setGuests((g) => Math.min(g, r.occupancy))
      if (!r.pricing.nightly) setStay('long')
    }
    setAvailability(null)
  }

  const changeCheckIn = (v: string) => {
    setCheckIn(v)
    if (checkOut && v && checkOut <= v) setCheckOut(addDays(v, 2))
  }

  // ---- validation
  function validateDates() {
    const e: Record<string, string> = {}
    if (pickable && !slug && !isViewing) e.room = 'Choose a room type.'
    if (!checkIn) e.checkIn = isViewing ? 'Choose a day for your viewing.' : short ? 'Choose a check-in date.' : 'Choose a move-in date.'
    else if (checkIn < today) e.checkIn = 'Choose a date from today onwards.'
    if (short) {
      if (!checkOut) e.checkOut = 'Choose a check-out date.'
      else if (checkIn && nightsBetween(checkIn, checkOut) < policies.minimumShortStayNights)
        e.checkOut = `Short stays are a minimum of ${plural(policies.minimumShortStayNights, 'night')}.`
    }
    return e
  }
  function validateDetails() {
    const e: Record<string, string> = {}
    if (name.trim().length < 2) e.name = 'Enter your full name.'
    if (!normalizeKenyanPhone(phone)) e.phone = 'Enter a Kenyan mobile number, e.g. 0712 345 678.'
    if (email && !isValidEmail(email)) e.email = 'Check your email address.'
    return e
  }

  async function onCheck(ev: React.FormEvent) {
    ev.preventDefault()
    const e = validateDates()
    setErrors(e)
    if (Object.keys(e).length) return
    if (isViewing || !room) {
      setStep('details')
      return
    }
    setBusy(true)
    try {
      setAvailability(await checkAvailability(room.slug, checkIn))
    } catch {
      setAvailability({ status: 'available', message: 'We couldn’t check live availability just now — send your details and we’ll confirm.' })
    }
    setBusy(false)
    setStep('details')
  }

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault()
    const e = validateDetails()
    setErrors(e)
    if (Object.keys(e).length) return
    const req: BookingRequest = {
      kind,
      roomSlug: room?.slug,
      stay: short ? 'short' : 'long',
      moveIn: checkIn,
      ...(short ? { checkOut } : isViewing ? {} : { months }),
      ...(isViewing && { viewingSlot: slot }),
      guests,
      name: name.trim(),
      phone: normalizeKenyanPhone(phone)!,
      ...(email && { email: email.trim() }),
      ...(notes.trim() && { notes: notes.trim() }),
    }
    setBusy(true)
    setFailed(false)
    try {
      setResult(await submitBooking(req))
      setSubmitted(req)
      setStep('done')
    } catch {
      setFailed(true)
    }
    setBusy(false)
  }

  const err = (k: string) =>
    errors[k] ? (
      <p id={`${uid}-${k}-err`} className="mt-1.5 text-xs text-danger">
        {errors[k]}
      </p>
    ) : null
  const a11y = (k: string) => ({ 'aria-invalid': Boolean(errors[k]), 'aria-describedby': errors[k] ? `${uid}-${k}-err` : undefined })
  const waitlist = availability?.status === 'waitlist'

  // ---------------------------------------------------------------- done
  if (step === 'done' && result && submitted) {
    return (
      <div className="animate-fade-up" role="status" aria-live="polite">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-ink text-paper">
          <Check className="h-5 w-5" />
        </span>
        <h3 className="display-md mt-6">
          {isViewing ? 'Viewing requested.' : result.status === 'waitlisted' ? 'You’re on the list.' : 'Request received.'}
        </h3>
        <p className="mt-4 leading-relaxed text-taupe">
          Thanks, {submitted.name.split(' ')[0]}. {site.name} will call or WhatsApp you on{' '}
          <span className="whitespace-nowrap text-ink">{submitted.phone}</span>{' '}
          {isViewing ? 'to confirm your viewing time.' : 'to confirm availability and next steps.'}
        </p>
        <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 border-y border-rule py-5 text-sm">
          <dt className="text-taupe">Reference</dt>
          <dd className="tabular font-semibold">{result.reference}</dd>
          {room && (
            <>
              <dt className="text-taupe">Space</dt>
              <dd>{room.name}</dd>
            </>
          )}
          <dt className="text-taupe">{isViewing ? 'Viewing' : short ? 'Dates' : 'Move-in'}</dt>
          <dd>
            {formatDate(submitted.moveIn)}
            {short && submitted.checkOut && ` → ${formatDate(submitted.checkOut)}`}
            {isViewing && `, ${slot}`}
            {!short && !isViewing && ` · ${plural(months, 'month')}`}
          </dd>
        </dl>
        {!isViewing && result.status !== 'waitlisted' && (
          <ol className="mt-6 space-y-3 text-sm">
            {[
              'We confirm your space and share the tenancy agreement.',
              `Pay the deposit (${policies.paymentMethods.join(' or ')}) to secure it.`,
              'Collect your keys on move-in day.',
            ].map((t, i) => (
              <li key={t} className="flex gap-3">
                <span className="tabular grid h-6 w-6 shrink-0 place-items-center rounded-full border border-rule text-xs">{i + 1}</span>
                <span className="pt-0.5 text-taupe">{t}</span>
              </li>
            ))}
          </ol>
        )}
        <a
          href={whatsappLink(waMessages.booking(submitted, room, result.reference))}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-whatsapp mt-8 w-full"
        >
          <WhatsAppIcon className="h-5 w-5" /> Continue on WhatsApp
        </a>
        <Link to="/rooms" className="btn btn-ghost-dark mt-3 w-full">
          Browse other rooms
        </Link>
      </div>
    )
  }

  const control = 'field-input'
  const selectCls = 'field-input select-chevron'

  // ---------------------------------------------------------------- details
  if (step === 'details') {
    return (
      <form onSubmit={onSubmit} noValidate className="animate-fade-up">
        <button type="button" onClick={() => setStep('dates')} className="inline-flex items-center gap-2 text-sm text-taupe hover:text-ink">
          <ArrowLeft className="h-4 w-4" /> Change {isViewing ? 'date' : 'dates'}
        </button>

        {availability && (
          <p
            className={`mt-5 border-l-2 py-1 pl-4 text-sm leading-relaxed ${waitlist ? 'border-taupe text-taupe' : 'border-[#3f8f5a] text-ink'}`}
            role="status"
          >
            {availability.message}
          </p>
        )}

        <p className="mt-5 text-sm text-taupe">
          {room ? `${room.name} · ` : ''}
          {isViewing
            ? `Viewing ${formatDate(checkIn)}, ${slot}`
            : short
              ? `${formatDate(checkIn)} → ${formatDate(checkOut)} · ${plural(nights, 'night')}`
              : `From ${formatDate(checkIn)} · ${plural(months, 'month')}`}{' '}
          · {plural(guests, isViewing ? 'person' : 'occupant')}
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label htmlFor={`${uid}-name`} className="field-label">
              Full name
            </label>
            <input id={`${uid}-name`} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className={`${control} mt-2`} {...a11y('name')} />
            {err('name')}
          </div>
          <div>
            <label htmlFor={`${uid}-phone`} className="field-label">
              Phone (WhatsApp preferred)
            </label>
            <input
              id={`${uid}-phone`}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="0712 345 678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={`${control} mt-2`}
              {...a11y('phone')}
            />
            {err('phone')}
          </div>
          <div>
            <label htmlFor={`${uid}-email`} className="field-label">
              Email <span className="normal-case tracking-normal">(optional)</span>
            </label>
            <input id={`${uid}-email`} type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`${control} mt-2`} {...a11y('email')} />
            {err('email')}
          </div>
          <div>
            <label htmlFor={`${uid}-notes`} className="field-label">
              Anything we should know? <span className="normal-case tracking-normal">(optional)</span>
            </label>
            <textarea
              id={`${uid}-notes`}
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={isViewing ? 'e.g. I’ll come with a parent' : 'e.g. university and year, parking needed, a friend to share with'}
              className={`${control} mt-2 resize-none py-3`}
            />
          </div>
        </div>

        {failed && (
          <p className="mt-5 text-sm text-danger" role="alert">
            Something went wrong sending your request.{' '}
            <a href={whatsappLink(waMessages.general())} target="_blank" rel="noopener noreferrer" className="underline">
              Send it on WhatsApp instead
            </a>
            .
          </p>
        )}

        <button type="submit" disabled={busy} className="btn btn-ink mt-6 w-full">
          {busy ? (
            <>
              <LoaderCircle className="animate-spin h-4 w-4" /> Sending…
            </>
          ) : (
            <>
              {isViewing ? 'Request viewing' : waitlist ? 'Join the waitlist' : 'Send reservation request'}
              <ArrowRight className="btn-arrow h-4 w-4" />
            </>
          )}
        </button>
        <p className="mt-3 text-center text-xs text-taupe">No payment now. We’ll confirm everything with you first.</p>
      </form>
    )
  }

  // ---------------------------------------------------------------- dates
  return (
    <form onSubmit={onCheck} noValidate>
      {pickable && (
        <div role="radiogroup" aria-label="What would you like to do?" className="mb-6 grid grid-cols-2 border border-rule p-1">
          {(
            [
              ['reservation', 'Reserve a space'],
              ['viewing', 'Book a viewing'],
            ] as const
          ).map(([k, label]) => (
            <button
              key={k}
              type="button"
              role="radio"
              aria-checked={kind === k}
              onClick={() => {
                setKind(k)
                setErrors({})
              }}
              className={`h-11 text-[0.75rem] font-semibold uppercase tracking-[0.12em] transition-colors ${kind === k ? 'bg-ink text-paper' : 'text-taupe hover:text-ink'}`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-4">
        {pickable && (
          <div>
            <label htmlFor={`${uid}-room`} className="field-label">
              Room type
            </label>
            <select id={`${uid}-room`} value={slug} onChange={(e) => pickRoom(e.target.value)} className={`${selectCls} mt-2`} {...a11y('room')}>
              <option value="">{isViewing ? 'Not sure yet — show me around' : 'Choose a room…'}</option>
              {rooms.map((r) => (
                <option key={r.slug} value={r.slug}>
                  {r.name} — from {formatKsh(r.pricing.monthly)}/mo
                </option>
              ))}
            </select>
            {err('room')}
          </div>
        )}

        {!isViewing && room?.pricing.nightly && (
          <div role="radiogroup" aria-label="Length of stay" className="grid grid-cols-2 gap-2">
            {(
              [
                ['long', 'Monthly', `${formatKsh(room.pricing.monthly)} / mo`],
                ['short', 'Nightly', `${formatKsh(room.pricing.nightly)} / night`],
              ] as const
            ).map(([v, label, price]) => (
              <button
                key={v}
                type="button"
                role="radio"
                aria-checked={stay === v}
                onClick={() => setStay(v)}
                className={`border px-3 py-2.5 text-left transition-colors ${stay === v ? 'border-ink bg-paper' : 'border-rule hover:border-ink/40'}`}
              >
                <span className="block text-[0.6875rem] font-semibold uppercase tracking-[0.14em]">{label}</span>
                <span className="tabular block text-sm text-taupe">{price}</span>
              </button>
            ))}
          </div>
        )}

        <div className={`grid gap-3 ${short || isViewing ? 'grid-cols-2' : 'grid-cols-1 xs:grid-cols-2'}`}>
          <div>
            <label htmlFor={`${uid}-in`} className="field-label">
              {isViewing ? 'Viewing day' : short ? 'Check-in' : 'Move-in date'}
            </label>
            <input
              id={`${uid}-in`}
              type="date"
              min={today}
              value={checkIn}
              onChange={(e) => changeCheckIn(e.target.value)}
              className={`${control} mt-2`}
              {...a11y('checkIn')}
            />
            {err('checkIn')}
          </div>
          {isViewing ? (
            <div>
              <label htmlFor={`${uid}-slot`} className="field-label">
                Time
              </label>
              <select id={`${uid}-slot`} value={slot} onChange={(e) => setSlot(e.target.value)} className={`${selectCls} mt-2`}>
                {viewingSlots.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
          ) : short ? (
            <div>
              <label htmlFor={`${uid}-out`} className="field-label">
                Check-out
              </label>
              <input
                id={`${uid}-out`}
                type="date"
                min={checkIn ? addDays(checkIn, 1) : addDays(today, 1)}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className={`${control} mt-2`}
                {...a11y('checkOut')}
              />
              {err('checkOut')}
            </div>
          ) : (
            <div>
              <label htmlFor={`${uid}-months`} className="field-label">
                Stay duration
              </label>
              <select id={`${uid}-months`} value={months} onChange={(e) => setMonths(Number(e.target.value))} className={`${selectCls} mt-2`}>
                {stayLengths.map((m) => (
                  <option key={m} value={m}>
                    {m} months{m === 4 ? ' · semester' : m === 9 ? ' · academic year' : ''}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        {!checkIn && !isViewing && !short && (
          // 36px tap target; the negative margins keep the text where a bare line would sit
          <button
            type="button"
            onClick={() => changeCheckIn(suggestedMoveIn())}
            className="-mt-3.5 mb-1.5 flex min-h-9 w-fit items-center text-xs text-clay-deep"
          >
            <span className="link-line">Move in on {formatDate(suggestedMoveIn())}?</span>
          </button>
        )}

        <div>
          <span className="field-label" id={`${uid}-guests`}>
            {isViewing ? 'People coming' : 'Occupants'}
          </span>
          <div className="mt-2 flex h-12 items-center justify-between border border-rule bg-paper px-2" role="group" aria-labelledby={`${uid}-guests`}>
            <button
              type="button"
              onClick={() => setGuests((g) => Math.max(1, g - 1))}
              disabled={guests <= 1}
              aria-label="Fewer"
              className="grid h-9 w-9 place-items-center text-taupe hover:text-ink disabled:opacity-30"
            >
              <Minus className="h-4 w-4" />
            </button>
            <output className="tabular font-medium" aria-live="polite">
              {guests}
              {!isViewing && room && <span className="font-normal text-taupe"> of {maxGuests} max</span>}
            </output>
            <button
              type="button"
              onClick={() => setGuests((g) => Math.min(isViewing ? 6 : maxGuests, g + 1))}
              disabled={guests >= (isViewing ? 6 : maxGuests)}
              aria-label="More"
              className="grid h-9 w-9 place-items-center text-taupe hover:text-ink disabled:opacity-30"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* estimate */}
      {room && !isViewing && (
        <dl className="mt-6 space-y-2 border-t border-rule pt-5 text-sm">
          {short ? (
            <>
              <div className="flex justify-between">
                <dt className="text-taupe">
                  {formatKsh(room.pricing.nightly!)} × {nights > 0 ? plural(nights, 'night') : '— nights'}
                </dt>
                <dd className="tabular">{nights > 0 ? formatKsh(nightlyTotal) : '—'}</dd>
              </div>
              <div className="flex justify-between border-t border-rule pt-3 font-semibold">
                <dt>Total</dt>
                <dd className="tabular">{nights > 0 ? formatKsh(nightlyTotal) : '—'}</dd>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between">
                <dt className="text-taupe">Monthly rent{units > 1 ? ` (${units} beds)` : ''}</dt>
                <dd className="tabular">{formatKsh(monthly)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-taupe">Refundable deposit</dt>
                <dd className="tabular">{formatKsh(deposit)}</dd>
              </div>
              <div className="flex justify-between border-t border-rule pt-3 font-semibold">
                <dt>Due before move-in</dt>
                <dd className="tabular">{formatKsh(monthly + deposit)}</dd>
              </div>
            </>
          )}
        </dl>
      )}

      <button type="submit" disabled={busy} className="btn btn-ink mt-6 w-full">
        {busy ? (
          <>
            <LoaderCircle className="animate-spin h-4 w-4" /> Checking…
          </>
        ) : (
          <>
            {isViewing ? 'Continue' : 'Check availability'} <ArrowRight className="btn-arrow h-4 w-4" />
          </>
        )}
      </button>
      <p className="mt-3 text-center text-xs text-taupe">
        {isViewing ? 'Viewings are free and take about 20 minutes.' : 'Free to request. No payment taken online.'}
      </p>
    </form>
  )
}
