'use client';

import { useEffect, useState } from 'react';

const SCOPES = new Set(['line', 'broader']);

export function OrderForm() {
  const [scope, setScope] = useState('');
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const next = query.get('scope');
    if (SCOPES.has(next)) setScope(next);
    if (query.get('sent') === '1') setSent(true);
  }, []);

  return (
    <section className="section" id="enquiry">
      <div className="wrap" style={{ maxWidth: 640 }}>
        <p className="form-status" hidden={!sent}>
          Thank you. The enquiry is in. We reply by email — in English, Russian, or Belarusian, whichever you chose.
        </p>
        <form className="panel lead-form" action="https://api.web3forms.com/submit" method="POST">
          <input type="hidden" name="access_key" value="bfb3a2dd-b595-4f9b-9773-a076f735d73d" />
          <input type="hidden" name="from_name" value="Heritavia" />
          <input type="hidden" name="topic" value="heritage-enquiry" />
          <input type="hidden" name="subject" value="Heritavia — investigation enquiry" />
          <input type="hidden" name="redirect" value="https://heritavia.com/contact/start/?sent=1" />
          <input
            type="checkbox"
            name="botcheck"
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
            style={{ display: 'none' }}
            aria-hidden="true"
          />

          <label htmlFor="name">Name</label>
          <input id="name" name="name" required autoComplete="name" />

          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required autoComplete="email" />

          <label htmlFor="correspondence">Language for correspondence</label>
          <select id="correspondence" name="correspondence" defaultValue="en">
            <option value="en">English</option>
            <option value="ru">Russian</option>
            <option value="be">Belarusian</option>
          </select>

          <label htmlFor="scope">What you are asking for</label>
          <select
            id="scope"
            name="scope"
            required
            value={scope}
            onChange={(event) => setScope(event.target.value)}
          >
            <option value="" disabled>
              Choose one
            </option>
            <option value="line">One line — request a line assessment</option>
            <option value="broader">Broader research — more than one line</option>
          </select>

          <label htmlFor="geography">Family geography</label>
          <input id="geography" name="geography" placeholder="A village, a parish, a region — as the family says it" />

          <label htmlFor="surnames">Known surnames</label>
          <input id="surnames" name="surnames" />

          <label htmlFor="assets">What you already have</label>
          <textarea id="assets" name="assets" placeholder="Papers, a tree, DNA, oral history — or nothing yet" />

          <label htmlFor="message">Comment</label>
          <textarea id="message" name="message" placeholder="The question you actually want answered" />

          <div className="form-actions">
            <button className="btn btn-heritage" type="submit">
              {scope === 'line' ? 'Request a line assessment' : 'Start your investigation'}
            </button>
          </div>
          <p className="form-note fine">
            There is no checkout. We read the brief and reply with what looks realistic and what it would cost.
            Most investigations, once the question is clear, sit somewhere from about €1,000 to €10,000 or more.
            That is an orientation, not a quote, and not a promise of how far a line will go.
          </p>
        </form>
      </div>
    </section>
  );
}
