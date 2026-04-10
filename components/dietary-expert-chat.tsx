"use client";

import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";

import {
  MessageSquareText,
  Send,
  ShieldAlert,
  ShieldCheck,
  X
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  dietaryExpertSuggestions,
  runDietaryExpertQuery,
  type DietaryExpertResponse
} from "@/lib/dietary-expert";
import { type MealFeedEntry } from "@/lib/meal-query";
import { formatPositiveDietarySignals } from "@/lib/sample-data";
import { cn } from "@/lib/utils";

type DietaryExpertChatProps = {
  entries: MealFeedEntry[];
  onJumpToEntry?: (entryId: string) => void;
};

type ChatTurn = {
  id: string;
  role: "assistant" | "user";
  text: string;
  response?: DietaryExpertResponse;
};

export function DietaryExpertChat({
  entries,
  onJumpToEntry
}: DietaryExpertChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [turns, setTurns] = useState<ChatTurn[]>([
    {
      id: "assistant-intro",
      role: "assistant",
      text:
        "I am the safety-first dietary expert for this app. Ask me about the meals we currently have stored, and I will only answer from that approved dataset."
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const suggestionList = useMemo(
    () => dietaryExpertSuggestions.slice(0, 4),
    []
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end"
    });
  }, [isOpen, turns]);

  function submitQuery(nextQuery: string) {
    const trimmedQuery = nextQuery.trim();

    if (!trimmedQuery) {
      return;
    }

    const response = runDietaryExpertQuery(trimmedQuery, entries);

    setTurns((currentTurns) => [
      ...currentTurns,
      {
        id: `user-${currentTurns.length + 1}`,
        role: "user",
        text: trimmedQuery
      },
      {
        id: `assistant-${currentTurns.length + 1}`,
        role: "assistant",
        text: response.summary,
        response
      }
    ]);
    setQuery("");
    setIsOpen(true);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submitQuery(query);
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <section className="flex h-[min(44rem,calc(100vh-2rem))] w-[min(26rem,calc(100vw-1rem))] flex-col overflow-hidden rounded-[2rem] border bg-white/95 shadow-[0_30px_90px_rgba(40,34,23,0.22)] backdrop-blur">
          <header className="border-b bg-[linear-gradient(135deg,rgba(245,250,244,0.98)_0%,rgba(232,243,235,0.98)_100%)] px-5 py-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Safety Desk
                  </p>
                  <h2 className="mt-1 text-lg font-semibold">
                    Dietary Expert
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Grounded only in the approved meals currently stored in the
                    app.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full border bg-white/90 p-2 text-muted-foreground transition hover:border-primary hover:text-primary"
                aria-label="Close dietary expert"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </header>

          <div className="flex-1 space-y-4 overflow-y-auto bg-[linear-gradient(180deg,rgba(253,251,245,0.92)_0%,rgba(255,255,255,0.96)_100%)] px-4 py-4">
            {turns.map((turn) => (
              <div
                key={turn.id}
                className={cn(
                  "flex",
                  turn.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[92%] rounded-[1.4rem] px-4 py-3 text-sm leading-6 shadow-sm",
                    turn.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "border bg-white text-foreground"
                  )}
                >
                  {turn.role === "assistant" ? (
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <ShieldCheck className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p>{turn.text}</p>
                        {turn.response ? (
                          <AssistantResponseBody
                            response={turn.response}
                            onJumpToEntry={onJumpToEntry}
                          />
                        ) : null}
                      </div>
                    </div>
                  ) : (
                    <p>{turn.text}</p>
                  )}
                </div>
              </div>
            ))}

            <div ref={messagesEndRef} />
          </div>

          <div className="border-t bg-white/95 px-4 py-4">
            <div className="mb-3 flex flex-wrap gap-2">
              {suggestionList.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => submitQuery(suggestion)}
                  className="rounded-full border bg-background px-3 py-2 text-xs font-medium text-muted-foreground transition hover:border-primary hover:text-primary"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            <form className="flex items-end gap-2" onSubmit={handleSubmit}>
              <label className="sr-only" htmlFor="dietary-expert-query">
                Ask the dietary expert
              </label>
              <textarea
                id="dietary-expert-query"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Ask about nut-free, soy-free, kosher, halal, or the safest current meals."
                rows={2}
                className="min-h-[3.25rem] flex-1 resize-none rounded-[1.3rem] border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <Button className="h-[3.25rem] rounded-[1.2rem] px-4" type="submit">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </section>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-3 rounded-full border bg-white/95 px-4 py-3 shadow-[0_18px_50px_rgba(40,34,23,0.18)] backdrop-blur transition hover:-translate-y-0.5 hover:border-primary"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <MessageSquareText className="h-5 w-5" />
          </div>
          <div className="text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Safety-First
            </p>
            <p className="text-sm font-semibold text-foreground group-hover:text-primary">
              Ask the Dietary Expert
            </p>
          </div>
        </button>
      )}
    </div>
  );
}

function AssistantResponseBody({
  response,
  onJumpToEntry
}: {
  response: DietaryExpertResponse;
  onJumpToEntry?: (entryId: string) => void;
}) {
  return (
    <div className="mt-3 space-y-3">
      <div className="rounded-[1.2rem] border bg-[linear-gradient(135deg,rgba(246,250,244,1)_0%,rgba(233,241,236,1)_100%)] p-3">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
          Trust boundary
        </p>
        <p className="mt-2 text-sm leading-6 text-foreground/85">
          {response.trustBoundary}
        </p>
      </div>

      <div className="rounded-[1.2rem] border bg-[linear-gradient(135deg,rgba(255,248,240,1)_0%,rgba(246,234,220,1)_100%)] p-3">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
          Caution
        </p>
        <p className="mt-2 text-sm leading-6 text-foreground/85">
          {response.caution}
        </p>
      </div>

      {response.results.length > 0 ? (
        <div className="space-y-3">
          {response.results.map((entry) => {
            const dietarySignals = entry.menuItem.dietaryAttributes
              ? formatPositiveDietarySignals(entry.menuItem.dietaryAttributes)
              : [];

            return (
              <article
                key={entry.id}
                className="rounded-[1.3rem] border bg-background/90 p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      {entry.restaurantName}
                    </p>
                    <h3 className="mt-1 text-base font-semibold">
                      {entry.menuItem.name}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {entry.distanceMiles.toFixed(1)} miles away
                    </p>
                  </div>
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
                    {entry.menuItem.status}
                  </span>
                </div>

                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {entry.menuItem.confidenceNote}
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {dietarySignals.map((label) => (
                    <span
                      key={label}
                      className="rounded-full border bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground"
                    >
                      {label}
                    </span>
                  ))}
                  {entry.menuItem.verificationBadges.map((badge) => (
                    <span
                      key={badge}
                      className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary"
                    >
                      {badge}
                    </span>
                  ))}
                </div>

                {onJumpToEntry ? (
                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={() => onJumpToEntry(entry.id)}
                      className="rounded-full border px-3 py-2 text-xs font-semibold text-muted-foreground transition hover:border-primary hover:text-primary"
                    >
                      Jump to this meal in the feed
                    </button>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
