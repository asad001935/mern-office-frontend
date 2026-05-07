import { useState } from "react";
import { Bot, Send } from "lucide-react";
import { toast } from "react-toastify";
import { askAssistant } from "../api/assistantApi";
import Loader from './Loader';

export default function AiAssistant() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(null);
  const [loading, setLoading] = useState(false);

  const ask = async (prompt = question) => {
    if (!prompt.trim()) return;

    try {
      setLoading(true);
      const response = await askAssistant(prompt);
      setAnswer(response);
      setQuestion("");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Assistant could not answer",
      );
    } finally {
      setLoading(false);
    }
  };

  const suggestions = answer?.suggestions || [
    "What is popular today?",
    "What items are available?",
    "Recommend batching",
  ];

  return (
    <>
      {loading && <Loader text="Wait for a while..." />}

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
            <Bot size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-950 dark:text-white">
              Office AI Assistant
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Answers only from this lunch system data.
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-lg bg-slate-50 p-4 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">
          {answer?.answer ||
            "Ask about available items, popular items, demand prediction, order status, or delivery batching."}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {suggestions.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => ask(item)}
              className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 dark:bg-slate-800 dark:text-slate-200"
            >
              {item}
            </button>
          ))}
        </div>

        <form
          className="mt-4 flex gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            ask();
          }}
        >
          <input
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Ask about orders, menus, demand..."
            className="h-10 min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
          <button
            type="submit"
            disabled={loading}
            className="grid size-10 place-items-center rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-slate-300"
          >
            <Send size={16} />
          </button>
        </form>
      </section>
    </>
  );
}
