-- Enable Realtime for GPS tracking
-- This allows WebSocket subscriptions to gps_data table

-- Enable Realtime on gps_data table
ALTER PUBLICATION supabase_realtime ADD TABLE gps_data;

-- Optional: Add comment for documentation
COMMENT ON TABLE gps_data IS 'GPS data table with realtime enabled for live tracking';

