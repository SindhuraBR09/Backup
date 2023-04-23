package com.eventsearch.app;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;
import androidx.viewpager2.adapter.FragmentStateAdapter;
import androidx.viewpager2.widget.ViewPager2;

import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.TextView;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.google.android.material.tabs.TabLayout;
import com.google.android.material.tabs.TabLayoutMediator;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class EventDetailsActivity extends AppCompatActivity {

    private TabLayout tabLayout;
    private ViewPager2 viewPager;
    private Event selectedEvent;

    private JSONArray artists;

    private JSONArray artistDetails;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_event_details);
        selectedEvent = getIntent().getParcelableExtra("selected_event");
        TextView backButton = findViewById(R.id.back_to_eventlist);
        backButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                finish();
            }
        });

        tabLayout = findViewById(R.id.tabLayout3);
        viewPager = findViewById(R.id.viewPager3);
        artistDetails = new JSONArray();
        if(selectedEvent.getGenres().contains("Music")){
            artists = selectedEvent.getArtistsDetails();
            try {
                for(int i=0; i< artists.length();i++){
                    JSONObject artistObj = artists.getJSONObject(i);
                    Log.d("ArtistFragment: ",artistObj.getString("name"));
                    String url = "https://reactapp-380904.uc.r.appspot.com/getArtistAlbums?name=" + artistObj.getString("name");
                    JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.GET, url, null, new Response.Listener<JSONObject>() {
                        @Override
                        public void onResponse(JSONObject response) {
                            Log.d("Artist Details ", response.toString());
                            artistDetails.put(response);

                        }
                    }, new Response.ErrorListener() {
                        @Override
                        public void onErrorResponse(VolleyError error) {
                            Log.e("VolleyError while fetching artists", "");
                        }
                    });
                    Volley.newRequestQueue(this).add(jsonObjectRequest);
                }
            }
            catch (JSONException e) {
                throw new RuntimeException(e);
            } ;
        }
        Log.d("Artists details from Spotify :", artistDetails.toString());
        viewPager.setAdapter(new FragmentStateAdapter(this) {
            @NonNull
            @Override
            public Fragment createFragment(int position) {
                // Return the fragment for the corresponding tab.
                Bundle bundle = new Bundle();
                switch (position) {
                    case 0:
                        EventDetailsFragment eventDetailsFragment  = new EventDetailsFragment();
                        bundle.putParcelable("selected_event", selectedEvent);
                        eventDetailsFragment.setArguments(bundle);
                        return  eventDetailsFragment;
                    case 1:
                        Log.d("EvenDetailsActivity: Current Artists ",artistDetails.toString());
                        ArtistFragment artistsDetailsFragment  = new ArtistFragment();
                        bundle.putString("artist_details", artistDetails.toString());
                        artistsDetailsFragment.setArguments(bundle);
                        return artistsDetailsFragment;
                    case 2:
                        VenueFragment venueFragment = new VenueFragment();
                        bundle.putString("venue_details", selectedEvent.getVenueDetailsDetails().toString());
                        venueFragment.setArguments(bundle);
                        return venueFragment;
                    default:
                        return null;
                }
            }

            @Override
            public int getItemCount() {
                return 3;
            }
        });

        new TabLayoutMediator(tabLayout, viewPager, (tab, position) -> {
            // Set the text for the tabs.
            switch (position) {
                case 0:
                    tab.setText("DETAILS");
                    break;
                case 1:
                    tab.setText("ARTIST(S)");
                    break;
                case 2:
                    tab.setText("VENUE");
                    break;
            }
        }).attach();

        tabLayout.addOnTabSelectedListener(new TabLayout.OnTabSelectedListener() {
            @Override
            public void onTabSelected(TabLayout.Tab tab) {
                Log.d("EventDetailsActivity", "onTabSelected: " + tab.getPosition());
                viewPager.setCurrentItem(tab.getPosition());
            }

            @Override
            public void onTabUnselected(TabLayout.Tab tab) {

            }

            @Override
            public void onTabReselected(TabLayout.Tab tab) {

            }
        });

    }


}