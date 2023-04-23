package com.eventsearch.app;

import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.MarkerOptions;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * A simple {@link Fragment} subclass.
 * Use the {@link VenueFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class


VenueFragment extends Fragment {

    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;

    private JSONArray venueDetails;

    private TextView venueName;

    private TextView venueAddress;

    private TextView venueCity;

    private TextView venueContact;

    private TextView openHours;

    private TextView generalRule;

    private TextView childRule;

    private GoogleMap mMap;

    public VenueFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment VenueFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static VenueFragment newInstance(String param1, String param2) {
        VenueFragment fragment = new VenueFragment();
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
        return inflater.inflate(R.layout.fragment_venue, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {

        if (getArguments() != null) {
            String venueArray = getArguments().getString("venue_details");
            try {
                venueDetails=new JSONArray(venueArray);
            } catch (JSONException e) {
                Log.e("Error while creating venue details :",e.getMessage());
            }
        }

        venueName = view.findViewById(R.id.venueNameValue);
        venueAddress = view.findViewById(R.id.venueAddressValue);
        venueCity = view.findViewById(R.id.venueCityValue);
        venueContact = view.findViewById(R.id.venueContactValue);
        openHours = view.findViewById(R.id.OpenHours);
        childRule = view.findViewById(R.id.ChildRule);
        generalRule = view.findViewById(R.id.GeneralRule);
        SupportMapFragment mapFragment =(SupportMapFragment)getChildFragmentManager().findFragmentById(R.id.mapView);

        if(venueDetails != null && venueDetails.length()>0){
            try {
                String name = venueDetails.getJSONObject(0).optString("name");
                venueName.setText(name);
                JSONObject addressObj = venueDetails.getJSONObject(0).optJSONObject("address");
                if(addressObj != null){
                    String address = addressObj.optString("line1");
                    venueAddress.setText(address);
                }
                String city_state = "";
                JSONObject cityObj = venueDetails.getJSONObject(0).optJSONObject("city");
                if(cityObj != null){
                    city_state = cityObj.optString("name");
                }
                JSONObject stateObj = venueDetails.getJSONObject(0).optJSONObject("state");
                if(stateObj != null){
                    city_state = city_state + ","+ stateObj.optString("name");
                }
                venueCity.setText(city_state);
                JSONObject boxOfficeInfo = venueDetails.getJSONObject(0).optJSONObject("boxOfficeInfo");
                if(boxOfficeInfo != null){
                    String contact = boxOfficeInfo.optString("phoneNumberDetail");
                    venueContact.setText(contact);
                    String oh = boxOfficeInfo.optString("openHoursDetail");
                    openHours.setText(oh);
                }

                JSONObject generalruleObj = venueDetails.getJSONObject(0).optJSONObject("generalInfo");
                if(generalruleObj != null){
                    String gr = generalruleObj.optString("generalRule");
                    generalRule.setText(gr);

                    String cr = generalruleObj.optString("childRule");
                    childRule.setText(cr);
                }

            } catch (JSONException e) {
                Log.e("venueFrgament: ", e.getMessage());
            }
        }

        if (mapFragment != null) {
            mapFragment.getMapAsync(new OnMapReadyCallback() {
                @Override
                public void onMapReady(GoogleMap googleMap) {
                    mMap = googleMap;
                    double mLatitude = 0.0, mLongitude = 0.0;
                    try {

                        JSONObject locationObject = venueDetails.getJSONObject(0).optJSONObject("location");
                        if(locationObject != null){
                            mLatitude=Double.parseDouble(locationObject.optString("latitude"));
                            mLongitude=Double.parseDouble(locationObject.optString("longitude"));
                        }
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                    // Create LatLng object after parsing JSON object
                    LatLng location = new LatLng(mLatitude, mLongitude);
                    mMap.addMarker(new MarkerOptions().position(location).title("Location"));
                    // Move camera to the obtained location
                    mMap.moveCamera(CameraUpdateFactory.newLatLngZoom(location, 14));
                }
            });
        }

    }
}