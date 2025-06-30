-- Export of n8n_chat_histories_summary view definition
-- Generated on: $(date)

DROP VIEW IF EXISTS public.n8n_chat_histories_summary;

CREATE VIEW public.n8n_chat_histories_summary AS
WITH
  ranked_messages AS (
    SELECT
      n8n_chat_histories.id,
      n8n_chat_histories.session_id,
      n8n_chat_histories.message,
      n8n_chat_histories.timestampz,
      n8n_chat_histories.message ->> 'type'::text AS message_type,
      n8n_chat_histories.message ->> 'content'::text AS message_content,
      row_number() OVER (
        PARTITION BY
          n8n_chat_histories.session_id,
          (n8n_chat_histories.message ->> 'content'::text),
          (n8n_chat_histories.message ->> 'type'::text),
          (
            date_trunc('second'::text, n8n_chat_histories.timestampz)
          )
        ORDER BY
          n8n_chat_histories.timestampz DESC,
          n8n_chat_histories.id DESC
      ) AS duplicate_rank,
      row_number() OVER (
        PARTITION BY
          n8n_chat_histories.session_id
        ORDER BY
          n8n_chat_histories.timestampz DESC,
          n8n_chat_histories.id DESC
      ) AS message_rank
    FROM
      n8n_chat_histories
    WHERE
      (n8n_chat_histories.message ->> 'content'::text) IS NOT NULL
      AND (n8n_chat_histories.message ->> 'content'::text) <> ''::text
      AND TRIM(
        BOTH
        FROM
          n8n_chat_histories.message ->> 'content'::text
      ) <> ''::text
  ),
  deduplicated_messages AS (
    SELECT
      ranked_messages.id,
      ranked_messages.session_id,
      ranked_messages.message,
      ranked_messages.timestampz,
      ranked_messages.message_type,
      ranked_messages.message_content,
      ranked_messages.duplicate_rank,
      ranked_messages.message_rank
    FROM
      ranked_messages
    WHERE
      ranked_messages.duplicate_rank = 1
  ),
  last_15_messages AS (
    SELECT
      deduplicated_messages.id,
      deduplicated_messages.session_id,
      deduplicated_messages.message,
      deduplicated_messages.timestampz,
      deduplicated_messages.message_type,
      deduplicated_messages.message_content,
      deduplicated_messages.duplicate_rank,
      deduplicated_messages.message_rank
    FROM
      deduplicated_messages
    WHERE
      deduplicated_messages.message_rank <= 15
  )
SELECT
  l.session_id AS phone_number,
  count(*) AS total_messages,
  string_agg(
    (
      (
        (
          '['::text || to_char(
            (l.timestampz AT TIME ZONE 'UTC'::text),
            'YYYY-MM-DD HH24:MI:SS'::text
          )
        ) || '] '::text
      ) || CASE
        WHEN l.message_type = 'human'::text THEN 'USER: '::text
        WHEN l.message_type = 'ai'::text THEN 'AI: '::text
        ELSE l.message_type || ': '::text
      END
    ) || COALESCE(l.message_content, ''::text),
    '
'::text
    ORDER BY
      l.timestampz DESC
  ) AS all_messages_with_timestamps,
  min(l.timestampz) AS first_message_time,
  max(l.timestampz) AS last_message_time,
  sum(
    CASE
      WHEN l.message_type = 'human'::text THEN 1
      ELSE 0
    END
  ) AS human_messages,
  sum(
    CASE
      WHEN l.message_type = 'ai'::text THEN 1
      ELSE 0
    END
  ) AS ai_messages,
  max(
    CASE
      WHEN l.message_rank = 1 THEN l.message_content
      ELSE null::text
    END
  ) AS most_recent_message
FROM
  last_15_messages l
GROUP BY
  l.session_id
ORDER BY
  (max(l.timestampz)) DESC; 