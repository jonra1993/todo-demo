create type "public"."priority_level" as enum ('low', 'medium', 'high');


  create table "public"."todo" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "title" character varying(255) not null,
    "description" text,
    "completed" boolean not null default false,
    "priority" public.priority_level,
    "due_date" timestamp with time zone,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."todo" enable row level security;


  create table "public"."user" (
    "id" uuid not null,
    "email" character varying(255) not null,
    "name" character varying(255),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."user" enable row level security;

CREATE INDEX idx_todo_completed ON public.todo USING btree (completed);

CREATE INDEX idx_todo_due_date ON public.todo USING btree (due_date);

CREATE INDEX idx_todo_priority ON public.todo USING btree (priority);

CREATE INDEX idx_todo_user_completed ON public.todo USING btree (user_id, completed);

CREATE INDEX idx_todo_user_due_date ON public.todo USING btree (user_id, due_date) WHERE (due_date IS NOT NULL);

CREATE INDEX idx_todo_user_id ON public.todo USING btree (user_id);

CREATE INDEX idx_user_email ON public."user" USING btree (email);

CREATE UNIQUE INDEX todo_pkey ON public.todo USING btree (id);

CREATE UNIQUE INDEX user_email_key ON public."user" USING btree (email);

CREATE UNIQUE INDEX user_pkey ON public."user" USING btree (id);

alter table "public"."todo" add constraint "todo_pkey" PRIMARY KEY using index "todo_pkey";

alter table "public"."user" add constraint "user_pkey" PRIMARY KEY using index "user_pkey";

alter table "public"."todo" add constraint "todo_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE not valid;

alter table "public"."todo" validate constraint "todo_user_id_fkey";

alter table "public"."user" add constraint "user_email_key" UNIQUE using index "user_email_key";

alter table "public"."user" add constraint "user_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."user" validate constraint "user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    user_name VARCHAR(255);
BEGIN
    -- Extract name from email (everything before @)
    -- If email is "john.doe@example.com", name will be "john.doe"
    user_name := split_part(NEW.email, '@', 1);
    
    -- Insert into public.user table
    INSERT INTO public."user" (id, email, name, created_at, updated_at)
    VALUES (
        NEW.id,
        NEW.email,
        user_name,
        NEW.created_at,
        NEW.updated_at
    );
    
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$function$
;

grant delete on table "public"."todo" to "anon";

grant insert on table "public"."todo" to "anon";

grant references on table "public"."todo" to "anon";

grant select on table "public"."todo" to "anon";

grant trigger on table "public"."todo" to "anon";

grant truncate on table "public"."todo" to "anon";

grant update on table "public"."todo" to "anon";

grant delete on table "public"."todo" to "authenticated";

grant insert on table "public"."todo" to "authenticated";

grant references on table "public"."todo" to "authenticated";

grant select on table "public"."todo" to "authenticated";

grant trigger on table "public"."todo" to "authenticated";

grant truncate on table "public"."todo" to "authenticated";

grant update on table "public"."todo" to "authenticated";

grant delete on table "public"."todo" to "postgres";

grant insert on table "public"."todo" to "postgres";

grant references on table "public"."todo" to "postgres";

grant select on table "public"."todo" to "postgres";

grant trigger on table "public"."todo" to "postgres";

grant truncate on table "public"."todo" to "postgres";

grant update on table "public"."todo" to "postgres";

grant delete on table "public"."todo" to "service_role";

grant insert on table "public"."todo" to "service_role";

grant references on table "public"."todo" to "service_role";

grant select on table "public"."todo" to "service_role";

grant trigger on table "public"."todo" to "service_role";

grant truncate on table "public"."todo" to "service_role";

grant update on table "public"."todo" to "service_role";

grant delete on table "public"."user" to "anon";

grant insert on table "public"."user" to "anon";

grant references on table "public"."user" to "anon";

grant select on table "public"."user" to "anon";

grant trigger on table "public"."user" to "anon";

grant truncate on table "public"."user" to "anon";

grant update on table "public"."user" to "anon";

grant delete on table "public"."user" to "authenticated";

grant insert on table "public"."user" to "authenticated";

grant references on table "public"."user" to "authenticated";

grant select on table "public"."user" to "authenticated";

grant trigger on table "public"."user" to "authenticated";

grant truncate on table "public"."user" to "authenticated";

grant update on table "public"."user" to "authenticated";

grant delete on table "public"."user" to "postgres";

grant insert on table "public"."user" to "postgres";

grant references on table "public"."user" to "postgres";

grant select on table "public"."user" to "postgres";

grant trigger on table "public"."user" to "postgres";

grant truncate on table "public"."user" to "postgres";

grant update on table "public"."user" to "postgres";

grant delete on table "public"."user" to "service_role";

grant insert on table "public"."user" to "service_role";

grant references on table "public"."user" to "service_role";

grant select on table "public"."user" to "service_role";

grant trigger on table "public"."user" to "service_role";

grant truncate on table "public"."user" to "service_role";

grant update on table "public"."user" to "service_role";


  create policy "Users can create own todos"
  on "public"."todo"
  as permissive
  for insert
  to public
with check ((auth.uid() = user_id));



  create policy "Users can delete own todos"
  on "public"."todo"
  as permissive
  for delete
  to public
using ((auth.uid() = user_id));



  create policy "Users can update own todos"
  on "public"."todo"
  as permissive
  for update
  to public
using ((auth.uid() = user_id));



  create policy "Users can view own todos"
  on "public"."todo"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));



  create policy "Users can update own profile"
  on "public"."user"
  as permissive
  for update
  to public
using ((auth.uid() = id));



  create policy "Users can view own profile"
  on "public"."user"
  as permissive
  for select
  to public
using ((auth.uid() = id));



  create policy "Users cannot insert profile"
  on "public"."user"
  as permissive
  for insert
  to public
with check (false);


CREATE TRIGGER update_todo_updated_at BEFORE UPDATE ON public.todo FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_updated_at BEFORE UPDATE ON public."user" FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


