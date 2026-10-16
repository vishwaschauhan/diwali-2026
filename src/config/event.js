/**
 * ============================================================================
 *  EVENT CONFIGURATION — the only file you need to edit before sending invites
 * ============================================================================
 *
 *  Everything guests see (dates, times, venue, RSVP, schedule, contacts,
 *  calendar files, share text) is generated from this one object.
 *
 *  Rules of thumb
 *  - Leave a value as `null` / '' while it is unconfirmed. The site will show
 *    a graceful "to be announced" state instead of inventing anything.
 *  - Times are wall-clock times in `timezone` (Pearland = America/Chicago).
 *    Daylight-saving is handled automatically for calendar files.
 *  - The schedule is written as minutes AFTER the start time, so changing
 *    `startTime` moves the whole evening and nothing can drift out of sync.
 *
 *  See README.md for step-by-step instructions.
 */

export const EVENT = {
  // ---------------------------------------------------------------- identity
  year: 2026,
  edition: 10, // 10th annual. First celebration was in `firstYear`.
  firstYear: 2017,
  theme: 'A Decade of Lights',
  tagline: '10 Years. Countless Memories. One Bright Tradition.',
  title: 'Diwali Celebration 2026',

  /** Public URL where the site will live. Used for share links + Open Graph. */
  siteUrl: '', // e.g. 'https://diwali2026.example.com/'

  // ------------------------------------------------------------------- hosts
  hosts: {
    names: ['Garima', 'Vishwas'],
    signOff: 'With love (and a suspiciously long playlist),',
  },

  /**
   * Organizers shown in the contact area. Phone numbers are intentionally
   * blank: add them only if you're happy for them to be on a public page.
   * `phone` accepts any format; `whatsapp` should be digits with country code.
   */
  contacts: [
    { name: 'Vishwas', phone: '', whatsapp: '' },
    { name: 'Abhay', phone: '', whatsapp: '' },
    { name: 'Shivraj', phone: '', whatsapp: '' },
    { name: 'Aman', phone: '', whatsapp: '' },
  ],

  // ------------------------------------------------------------- date & time
  /** Party date, 'YYYY-MM-DD'. NOT the festival date (Diwali is Nov 8, 2026). */
  date: null, // e.g. '2026-11-07'
  /** 24-hour 'HH:MM'. The whole schedule below hangs off this one value. */
  startTime: '18:30',
  /** Set to true once the start time is final; until then it reads "tentative". */
  startTimeConfirmed: false,
  /** How long the calendar entry should be, in minutes. */
  durationMinutes: 300,
  timezone: 'America/Chicago',
  timezoneLabel: 'Central Time',

  /** Official festival date — shown only as context, never as the party date. */
  festivalDate: '2026-11-08',

  // ------------------------------------------------------------------- venue
  venue: {
    title: "Garima & Vishwas' home", // shown even when the address is private
    city: 'Pearland',
    state: 'TX',
    /** Full street address. Leave '' until confirmed. */
    address: '', // e.g. '123 Example Ln, Pearland, TX 77584'

    /**
     * Who can see the street address on the site:
     *  'public'   — anyone with the link sees it, plus directions buttons.
     *  'passcode' — guests type a passcode to reveal it. The address is stored
     *               encrypted (run `npm run encrypt-address`), so it is NOT
     *               readable from the page source without the passcode.
     *  'private'  — never shown; guests are told it arrives with RSVP follow-up.
     */
    addressMode: 'passcode',
    /** Output of `npm run encrypt-address` (only used with 'passcode'). */
    encryptedAddress: null,
    /** Optional: override the Google Maps link instead of building one. */
    mapsUrl: '',

    parkingNotes: [
      'Street parking only. Please keep driveways and fire hydrants clear (our neighbours are lovely and we would like to keep it that way).',
      'Parking is limited, so arriving on time has its perks.',
      'Carpooling is strongly encouraged. Fewer cars, more dancers.',
      'Coming from out of town or need a hand? Reach out to us before the day.',
    ],
    lostLine: 'Still lost? Call us, or simply follow the sound of laughter and the smell of food.',
  },

  dressCode: 'Festive best. Indian traditional attire is encouraged, but come as you are.',

  // -------------------------------------------------------------------- RSVP
  rsvp: {
    /** 'YYYY-MM-DD'. Leave null to hide the deadline entirely. */
    deadline: null,

    /**
     * How RSVPs are collected:
     *  'demo'        — form works but sends nothing; clearly labelled as a preview.
     *  'google-form' — the on-page form posts straight into a Google Form.
     *                  Fill in `googleForm` below (see README for the 2-minute setup).
     *  'link'        — the RSVP buttons open `externalUrl` (any service).
     */
    mode: 'demo',

    googleForm: {
      /** The long id from https://docs.google.com/forms/d/e/<THIS>/viewform */
      formId: '',
      /** Map each field to its Google Form "entry.123456789" name. */
      fields: {
        name: '', // e.g. 'entry.1111111111'
        attending: '', // multiple choice: options must be exactly "Yes" / "No"
        adults: '',
        children: '',
        dietary: '',
        notes: '',
      },
    },

    externalUrl: '',
  },

  // ---------------------------------------------------------------- schedule
  /** `offset` is minutes after `startTime`. Last item may be open-ended. */
  schedule: [
    { offset: 0, title: 'Arrival & appetizers', note: 'Come in, say hello, grab a plate. The appetizers wait for no one.' },
    { offset: 45, title: 'Aarti & group photo', note: 'A moment of gratitude, followed by the annual attempt to fit everyone in one frame.' },
    { offset: 60, title: 'Dinner & drinks', note: 'Homemade, generous, and served with zero judgement on seconds.' },
    { offset: 120, title: 'Dance floor opens', note: 'Runs until your energy gets lost. Ours historically gets lost last.' },
  ],

  // ------------------------------------------------------------ memory lane
  /**
   * One entry per year. Photos are picked up automatically from
   * src/photos/<year>/ (drop JPG/PNG/WebP files in). If that folder is empty,
   * the legacy Google Sites photos listed in scripts/legacy-photo-urls.json
   * are used. `note` is optional and should only state real facts.
   */
  chapters: [
    { year: 2017, label: 'First Edition', note: 'Where it all began.' },
    { year: 2018, label: 'Second Edition' },
    { year: 2019, label: 'Third Edition' },
    { year: 2020, label: 'Fourth Edition', note: 'The COVID year.' },
    { year: 2021, label: 'Fifth Edition' },
    { year: 2022, label: 'Sixth Edition' },
    { year: 2023, label: 'Seventh Edition' },
    { year: 2024, label: 'Eighth Edition' },
    { year: 2025, label: 'Ninth Edition', note: 'Theme: “Lights, Laughter, and a Ludicrous Load of Alliteration.”' },
    { year: 2026, label: 'Tenth Edition', note: 'A Decade of Lights. This chapter is still unwritten.' },
  ],
}
