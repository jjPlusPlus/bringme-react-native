# Documentation

A highly non-comprehensive documentation for the application architecture of BringMe

## API Architecture

### Table: Users
**id**: index, primary_key
**username**: string : *unique username, varchar but no spaces or symbols*
**email**: string : *user email address copied over during registration*
**auth_uuid**: string : *related uuid from Supabase Auth*
**created_at**: datetime
**updated_at**: datetime

### Table: Matches
**id**: index, primary_key
**code**: string : *unique, randomly-generated four-letter room code used to find multiplayer matches*
**players**: array : *array of player ID's*
**active**: boolean : soft-deletion mechanism so we don't run out fo room ID's
**created_at**: datetime
**started_at**: datetime : *when the match starts*
**finished_at**: datetime : *when the match ends*
**killed_at**: datetime: *when the match is deactivated. Might be the same as finished_at*
**status**: string: *one of: 'matchmaking', 'in_progress', 'finished'*

### Endpoint: /create_match
  Supabase Edge Function used to create a new Match
**Expects:** n/a
**Returns:** new Match table record with room code

### Endpoint: /kill_match
  Soft-deletion of a Match by setting the 'active' flag to false
**Expects:** Match ID
**Returns:** n/a

### Endpoint: /add_player_to_match
  Adds a player to a Match.
**Expects:** User ID
**Returns:** n/a

### Endpoint: /rm_player_from_match
  Removes a player from a Match.
**Expects:** User ID
**Returns:** n/a



## Application Architecture