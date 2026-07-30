"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import { siteConfig } from "@/lib/config";
import type { Dictionary } from "@/lib/dictionaries/ru";

type Status = "idle" | "sending" | "success" | "error";

/**
 * Форма обратной связи через Formspree (fetch POST, без бэкенда).
 * Endpoint — в lib/config.ts. Состояния по DESIGN.md (success/error tokens).
 */
export default function ContactForm({ dict }: { dict: Dictionary }) {
  const [status, setStatus] = useState<Status>("idle");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    try {
      const res = await fetch(siteConfig.formspreeEndpoint, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex h-full min-h-[320px] flex-col items-start justify-center rounded-lg border border-success/40 bg-surface-1 p-8"
      >
        <p className="font-mono text-xs uppercase tracking-widest text-success">
          {dict.contact.form.successTitle}
        </p>
        <p className="mt-3 text-text-secondary">
          {dict.contact.form.successText}
        </p>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-4"
      onSubmit={onSubmit}
    >
      {status === "error" && (
        <div className="rounded-md border border-error/40 bg-surface-1 px-4 py-3">
          <p className="text-sm font-medium text-error">
            {dict.contact.form.errorTitle}
          </p>
          <p className="mt-1 text-sm text-text-secondary">
            {dict.contact.form.errorText}
          </p>
        </div>
      )}
      <input
        type="text"
        name="name"
        placeholder={dict.contact.form.name}
        required
        className="h-12 w-full rounded-md border border-surface-3 bg-surface-2 px-4 text-sm text-text-primary outline-none transition-colors placeholder:text-text-tertiary focus:border-accent"
      />
      <input
        type="email"
        name="email"
        placeholder={dict.contact.form.email}
        required
        className="h-12 w-full rounded-md border border-surface-3 bg-surface-2 px-4 text-sm text-text-primary outline-none transition-colors placeholder:text-text-tertiary focus:border-accent"
      />
      <textarea
        name="message"
        placeholder={dict.contact.form.message}
        required
        rows={5}
        className="w-full resize-vertical rounded-md border border-surface-3 bg-surface-2 px-4 py-3 text-sm text-text-primary outline-none transition-colors placeholder:text-text-tertiary focus:border-accent"
      />
      <Button size="lg" className="w-full">
        {status === "sending" ? dict.contact.form.sending : dict.contact.form.submit}
      </Button>
    </motion.form>
  );
}
