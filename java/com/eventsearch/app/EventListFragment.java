package com.eventsearch.app;

import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ProgressBar;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;

/**
 * A simple {@link Fragment} subclass.
 * Use the {@link EventListFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class EventListFragment extends Fragment {

    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;

    String keyword;
    String location;
    String distance;
    String category;
    private List<Event> mEvents;

    RecyclerView recyclerView;

    ProgressBar progressBar;
    public EventListFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment EventListFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static EventListFragment newInstance(String param1, String param2) {
        EventListFragment fragment = new EventListFragment();
        Bundle args = new Bundle();
        args.putString(ARG_PARAM1, param1);
        args.putString(ARG_PARAM2, param2);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            mParam1 = getArguments().getString(ARG_PARAM1);
            mParam2 = getArguments().getString(ARG_PARAM2);
        }


    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment

        View view = inflater.inflate(R.layout.fragment_event_list, container, false);

        Button backButton = view.findViewById(R.id.back_button);
        backButton.setOnClickListener(v -> getActivity().finish());

        progressBar = view.findViewById(R.id.progress_bar);
        // Set its visibility to VISIBLE
        progressBar.setVisibility(View.VISIBLE);

        return view;

    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        if (getArguments() != null) {
//            events = getArguments().getString("event_list");
            keyword = getArguments().getString("keyword");
            location = getArguments().getString("location");
            distance = getArguments().getString("distance");
            category = getArguments().getString("category");
        }


        // Initialize the RecyclerView and adapter
        recyclerView = view.findViewById(R.id.eventlist_fragment);
        geocodeAddress(location);
//        Eventlist_Adapter adapter = new Eventlist_Adapter(mEvents);
//        recyclerView.setAdapter(adapter);
//        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
//        progressBar.setVisibility(View.GONE);

    }

    private void geocodeAddress(String location) {
        String myAPIKey = "AIzaSyBpZvMEg8E7OCm6Umc8FX80tXwiCFNCJ2k";
        String geocodingUrl = "https://maps.googleapis.com/maps/api/geocode/json?address=" + URLEncoder.encode(location) + "&key=" + myAPIKey;

        JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.GET, geocodingUrl, null,
                response -> {
                    try {
                        if(response.getString("status").equals("OK")){
                            JSONObject locationObj = response.getJSONArray("results")
                                    .getJSONObject(0)
                                    .getJSONObject("geometry")
                                    .getJSONObject("location");
                            double latitude = locationObj.getDouble("lat");
                            double longitude = locationObj.getDouble("lng");
                            Log.d("geocodeAddress", "Location " + latitude + " "+longitude);
                            getEvents(latitude, longitude);
                        }
                        else{
                            Log.d("geocodeAddress", "Error in geocodeAddress");
                        }
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                },
                error -> Log.d("geocodeAddress", "Volley error"));

        RequestQueue requestQueue = Volley.newRequestQueue(getContext());
        requestQueue.add(jsonObjectRequest);
    }

    private void getEvents(double latitude, double longitude) {

//        String keywordFromInput = mKeywordEditText.getText().toString();

//        if (!TextUtils.isEmpty(keywordFromInput) && keyword.equals(keywordFromInput)) {
//            keyword = keywordFromInput;
//        }
        category = category.toLowerCase();
        Log.d("EventListFragment", "Keyword: " + keyword);
        Log.d("EventListFragment", "Location: " + location);
        Log.d("EventListFragment", "Category: " + category);
        Log.d("EventListFragment", "Distance: " + distance);

        String searchUrl = "https://reactapp-380904.uc.r.appspot.com/searchForEvents/?key=" + keyword +
                "&dist=" + distance +
                "&genre=" + category +
                "&lat=" + latitude +
                "&lng=" + longitude +
                "&loc=" + location;

        JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.GET, searchUrl, null,
                response -> {
                    try {
                        Log.d("getEvents", "Response "+response);
                        if (response.has("_embedded") && response.getJSONObject("_embedded").has("events")) {
                            JSONArray eventsArray = response.getJSONObject("_embedded").getJSONArray("events");
                            displayEvents(eventsArray);
                        } else {
                            Log.d("getEvents", "No results");
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                },
                error -> Log.d("getEvents", "Volley error"));

        RequestQueue requestQueue = Volley.newRequestQueue(getContext());
        requestQueue.add(jsonObjectRequest);
    }

    private void displayEvents(JSONArray events){
        try {
            mEvents = new ArrayList<>();
            for (int i = 0; i < events.length(); i++) {
                JSONObject eventObject = events.getJSONObject(i);
                Event event = new Event();
                event.setId(eventObject.getString("id"));
                event.setName(eventObject.getString("name"));
                event.setImageUrl(eventObject.optString("url", ""));

                try {
                    JSONArray classifications = eventObject.getJSONArray("classifications");
                    if (classifications != null && classifications.length() > 0) {
                        JSONObject classification = classifications.getJSONObject(0);
                        if (classification != null) {
                            JSONObject genreObject = classification.getJSONObject("genre");
                            if (genreObject != null) {
                                String genreName = genreObject.getString("name");
                                if (genreName != null) {
                                    event.addGenre(genreName);
                                }
                            }
                        }
                    }
                } catch (JSONException e) {
                    Log.d("GetEvents: ", e.toString());
                    // Handle the case where the keys are not present in the JSON object.
                }

                JSONArray imagesArray = eventObject.optJSONArray("images");
                if (imagesArray != null && imagesArray.length() > 0) {
                    String imageUrl = imagesArray.getJSONObject(0).optString("url", "");
                    event.setImageUrl(imageUrl);
                }

                // For setting event date
                JSONObject datesObject = eventObject.optJSONObject("dates");
                if (datesObject != null) {
                    JSONObject startObject = datesObject.optJSONObject("start");
                    if (startObject != null) {
                        String date = startObject.optString("localDate", "");
                        event.setDate(date);
                        String time = startObject.optString("localTime", "");
                        event.setTime(time);
                    }
                }
                // For setting event venue
                JSONObject embeddedObject = eventObject.optJSONObject("_embedded");
                if (embeddedObject != null) {
                    JSONArray venuesArray = embeddedObject.optJSONArray("venues");
                    if (venuesArray != null && venuesArray.length() > 0) {
                        String venue = venuesArray.getJSONObject(0).optString("name", "");
                        event.setVenue(venue);
                    }
                }
                mEvents.add(event);
            }


        } catch (JSONException e) {
            e.printStackTrace();
        }

        // Initialize the RecyclerView and adapter
        Eventlist_Adapter adapter = new Eventlist_Adapter(mEvents);
        recyclerView.setAdapter(adapter);
        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        progressBar.setVisibility(View.GONE);

    }


}