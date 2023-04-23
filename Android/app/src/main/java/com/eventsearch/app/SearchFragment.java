package com.eventsearch.app;

import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.TextView;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import com.eventsearch.app.Event;

/**
 * A simple {@link Fragment} subclass.
 * Use the {@link SearchFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class SearchFragment extends Fragment implements AdapterView.OnItemSelectedListener {

    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;
    private EditText mKeywordEditText;
    private EditText mDistanceEditText;
    private Spinner mCategorySpinner;
    private EditText mLocationEditText;
    private Button submitButton;
    private Button clearButton;

    public SearchFragment() {
        // Required empty public constructor
    }
    public static SearchFragment newInstance(String param1, String param2) {
        SearchFragment fragment = new SearchFragment();
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
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {

        View view = inflater.inflate(R.layout.fragment_search, container, false);
        mKeywordEditText = (EditText) view.findViewById(R.id.keyword_edit_text);
        mDistanceEditText =  (EditText)view.findViewById(R.id.distance_edit_text);
        mLocationEditText = (EditText) view.findViewById(R.id.location_edit_text);
        mCategorySpinner = (Spinner) view.findViewById(R.id.category_spinner);

        ArrayAdapter<CharSequence> adapter = ArrayAdapter.createFromResource(getContext(),
                R.array.category_values, android.R.layout.simple_spinner_item);
        adapter.setDropDownViewResource(R.layout.spinner_dropdown_item);
        mCategorySpinner.setAdapter(adapter);
        mCategorySpinner.setOnItemSelectedListener(this);
        submitButton = view.findViewById(R.id.submit_button);
        submitButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String keyword = mKeywordEditText.getText().toString();
                String location = mLocationEditText.getText().toString();
                String category = mCategorySpinner.getSelectedItem().toString();
                String distance = mDistanceEditText.getText().toString();

                Log.d("SearchFragment", "Keyword: " + keyword);
                Log.d("SearchFragment", "Location: " + location);
                Log.d("SearchFragment", "Category: " + category);
                Log.d("SearchFragment", "Distance: " + distance);

                Intent intent = new Intent(getActivity(), EventListActivity.class);
                intent.putExtra("keyword", keyword);
                intent.putExtra("location", location);
                intent.putExtra("category", category);
                intent.putExtra("distance", distance);
                intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
                startActivity(intent);
//                geocodeAddress(location);
            }
        });

        return view;

    }

    @Override
    public void onItemSelected(AdapterView<?> adapterView, View view, int i, long l) {
        String text = adapterView.getItemAtPosition (i).toString();
        ((TextView) adapterView.getChildAt(0)).setTextColor(getResources().getColor(R.color.white));
        Log.d("SearchFragment", "onCategorySelected: " + text);

    }

    @Override
    public void onNothingSelected(AdapterView<?> adapterView) {

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

        String keyword = mKeywordEditText.getText().toString();
        String category = mCategorySpinner.getSelectedItem().toString();
        category = category.toLowerCase();
        String distance = mDistanceEditText.getText().toString();
        String location = mLocationEditText.getText().toString();

        Log.d("getEvents", "Keyword: " + keyword);
        Log.d("getEvents", "Location: " + latitude+ " "+ longitude);
        Log.d("getEvents", "Category: " + category);
        Log.d("getEvents", "Distance: " + distance);



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
//                            ArrayList<Event> eventsList = new ArrayList<>();
//                            for (int i = 0; i < eventsArray.length(); i++) {
//                                JSONObject eventObject = eventsArray.getJSONObject(i);
//                                Event event = new Event();
//                                event.setId(eventObject.getString("id"));
//                                event.setName(eventObject.getString("name"));
//                                event.setImageUrl(eventObject.optString("url", ""));
//
//                                try {
//                                    JSONArray classifications = eventObject.getJSONArray("classifications");
//                                    if (classifications != null && classifications.length() > 0) {
//                                        JSONObject classification = classifications.getJSONObject(0);
//                                        if (classification != null) {
//                                            JSONObject genreObject = classification.getJSONObject("genre");
//                                            if (genreObject != null) {
//                                                String genreName = genreObject.getString("name");
//                                                if (genreName != null) {
//                                                    event.addGenre(genreName);
//                                                }
//                                            }
//                                        }
//                                    }
//                                } catch (JSONException e) {
//                                    Log.d("GetEvents: ", e.toString());
//                                    // Handle the case where the keys are not present in the JSON object.
//                                }
//
//                                JSONArray imagesArray = eventObject.optJSONArray("images");
//                                if (imagesArray != null && imagesArray.length() > 0) {
//                                    String imageUrl = imagesArray.getJSONObject(0).optString("url", "");
//                                    event.setImageUrl(imageUrl);
//                                }
//
//                                // For setting event date
//                                JSONObject datesObject = eventObject.optJSONObject("dates");
//                                if (datesObject != null) {
//                                    JSONObject startObject = datesObject.optJSONObject("start");
//                                    if (startObject != null) {
//                                        String date = startObject.optString("localDate", "");
//                                        event.setDate(date);
//                                        String time = startObject.optString("localTime", "");
//                                        event.setTime(time);
//                                    }
//                                }
//                                // For setting event venue
//                                JSONObject embeddedObject = eventObject.optJSONObject("_embedded");
//                                if (embeddedObject != null) {
//                                    JSONArray venuesArray = embeddedObject.optJSONArray("venues");
//                                    if (venuesArray != null && venuesArray.length() > 0) {
//                                        String venue = venuesArray.getJSONObject(0).optString("name", "");
//                                        event.setVenue(venue);
//                                    }
//                                }
//                                eventsList.add(event);
//                            }
//                            Log.d("getEvents", "Event list size: " + eventsList.size());
                            startEventListActivity(eventsArray);
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

    private void startEventListActivity(JSONArray eventsArray) {

        Intent intent = new Intent(getActivity(), EventListActivity.class);

        intent.putExtra("event_list", (String) eventsArray.toString());
        intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
        startActivity(intent);

        // Create a new instance of the EventListFragment and pass the list of events as an argument
//        EventListFragment eventListFragment = new EventListFragment();
//        Bundle bundle = new Bundle();
//        bundle.putParcelableArrayList("event_list", (ArrayList<Event>) events);
//        eventListFragment.setArguments(bundle);
//
//        Log.d("SearchFrag",""+ ((ViewGroup)getView().getParent()).getId());
//
//        FragmentTransaction transaction = getParentFragmentManager().beginTransaction();
//        transaction.replace(((ViewGroup)getView().getParent()).getId(), eventListFragment);
//        transaction.addToBackStack(null);
//        transaction.commit();


    }


}

