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
import android.widget.ProgressBar;
import android.widget.TextView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

/**
 * A simple {@link Fragment} subclass.
 * Use the {@link ArtistFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class ArtistFragment extends Fragment {

    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;

    private Event selectedEvent;

    private JSONArray artists;

    RecyclerView recyclerView;

    ProgressBar progressBar;

    TextView no_results;

    private List<Artist> mArtists;

    public ArtistFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment ArtistFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static ArtistFragment newInstance(String param1, String param2) {
        ArtistFragment fragment = new ArtistFragment();
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
        return inflater.inflate(R.layout.fragment_artist, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);


        if (getArguments() != null) {
            String artistsArray = getArguments().getString("artist_details");
            try {
                artists=new JSONArray(artistsArray);
            } catch (JSONException e) {
                Log.e("Error while creating Artists :",e.getMessage());
            }
        }

        recyclerView = view.findViewById(R.id.artists_view);
        progressBar = view.findViewById(R.id.progress_bar);
        no_results = view.findViewById(R.id.no_results_textview);

        if(artists.length() > 0){
            try{
                mArtists = new ArrayList<>();
                for(int i=0;i< artists.length(); i++){
                    Artist artistObj = new Artist();
                    JSONObject artist = artists.getJSONObject(i);
                    String artistName = artist.optString("name","");
                    artistObj.setName(artistName);
                    String artistImage = artist.optString("artistPicture","");
                    artistObj.setProfilePicture(artistImage);
                    String followers = artist.optString("followers","");
                    artistObj.setFollowers(followers);
                    String popularity = artist.optString("popularity","");
                    artistObj.setPopularity(popularity);

                    JSONArray albums = artist.optJSONArray("items");
                    if (albums != null && albums.length() > 0) {
                        for(int j=0; j<albums.length();j++){
                            JSONArray albumImages = albums.getJSONObject(j).optJSONArray("images");
                            if(albumImages != null && albumImages.length() > 2){
                                artistObj.addAlbum(albumImages.getJSONObject(2).optString("url"));
                            }
                        }
                    }

                    mArtists.add(artistObj);

                }

            }
            catch (Exception e) {
                Log.e("ArtistFragment:", e.getMessage());
            }

            ArtistAdapter adapter = new ArtistAdapter(mArtists);
            recyclerView.setVisibility(View.VISIBLE);
            progressBar.setVisibility(View.GONE);
            recyclerView.setAdapter(adapter);
            recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));

        }
        else{
            recyclerView.setVisibility(View.GONE);
            no_results.setVisibility(View.VISIBLE);
            progressBar.setVisibility(View.GONE);
        }


    }
}