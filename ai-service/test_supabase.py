from supabase_client import supabase

response = supabase.table("vehicles").select("*").execute()

print("Supabase connection successful!")
print("Vehicles:")
print(response.data)