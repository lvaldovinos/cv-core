create table if not exists locations (
  id integer primary key,
  city text not null,
  country text not null,
  unique (city, country)
);
create table if not exists companies (
  id integer primary key,
  name text not null unique,
  webpage text not null unique,
  image_url text not null unique,
  location_id integer,
  foreign key (location_id) references locations (id)
);
create table if not exists roles (
  id integer primary key,
  name text not null,
  color text not null
);
create table if not exists tools (
  id integer primary key,
  name text not null,
  webpage text
);
create table if not exists projects (
  id integer primary key,
  name text not null,
  start_date text not null,
  end_date text,
  highlight text not null,
  client_id integer not null,
  vendor_id integer not null,
  foreign key (client_id) references companies (id),
  foreign key (vendor_id) references companies (id)
);
create table if not exists project_role_links (
  id integer primary key,
  project_id integer not null,
  role_id integer not null,
  foreign key (project_id) references projects (id),
  foreign key (role_id) references roles (id)
);
create table if not exists project_tool_links (
  id integer primary key,
  project_id integer not null,
  tool_id integer not null,
  foreign key (project_id) references projects (id),
  foreign key (tool_id) references tools (id)
);
