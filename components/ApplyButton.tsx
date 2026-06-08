"use client";

import { useState } from "react";
import styles from "@/app/vacatures/[id]/detail.module.css";

/**
 * Sollicitatie-knop — STUB (golf 2 detailpagina).
 *
 * Registreert de sollicitatie-intentie voorlopig ALLEEN lokaal (console +
 * localStorage). Er wordt bewust GEEN echte koppeling gebouwd.
 *
 * GAP: later stuurt deze actie de intentie automatisch door naar de IH-Hub via
 * de adapter-laag (lib/jobSource). Die call hoort — net als het ophalen van
 * vacatures — uitsluitend via lib/jobSource te lopen, zodat de bron op één plek
 * omgezet kan worden. Zie INTEGRATION-NOTES.md (GAP: IH-Hub-adapter).
 */

interface ApplyButtonProps {
  jobId: string;
  jobTitle: string;
  /**
   * De (testdata-)sollicitatie-URL uit het Job-contract. Nu alleen meegelogd
   * als intentie; later vervangt de adapter-call deze directe link.
   */
  applyUrl: string;
}

const STORAGE_KEY = "vacature-site:apply-intents";

export function ApplyButton({ jobId, jobTitle, applyUrl }: ApplyButtonProps) {
  const [registered, setRegistered] = useState(false);

  function handleApply() {
    // GAP: vervang dit lokale registreren later door een doorzet naar IH-Hub
    // via de adapter-laag (lib/jobSource). Geen echte koppeling in golf 2.
    const intent = {
      jobId,
      jobTitle,
      applyUrl,
      // Tijdstip puur indicatief voor de lokale stub-registratie.
      registeredAt: new Date().toISOString(),
    };

    // eslint-disable-next-line no-console
    console.log("[ApplyButton] sollicitatie-intentie geregistreerd (stub):", intent);

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const existing: unknown = raw ? JSON.parse(raw) : [];
      const list = Array.isArray(existing) ? existing : [];
      list.push(intent);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch {
      // localStorage kan ontbreken/vol zijn; de stub mag daar nooit op klappen.
    }

    setRegistered(true);
  }

  return (
    <div className={styles.applyBox}>
      <button
        type="button"
        className={styles.applyButton}
        onClick={handleApply}
        aria-live="polite"
      >
        {registered ? "Sollicitatie geregistreerd ✓" : "Direct solliciteren"}
      </button>
      {registered && (
        <p className={styles.applyNote}>
          Je sollicitatie-intentie is lokaal geregistreerd. In een latere fase
          wordt deze automatisch doorgezet.
        </p>
      )}
    </div>
  );
}
