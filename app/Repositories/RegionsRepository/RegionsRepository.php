<?php


namespace App\Repositories\RegionsRepository;
use Illuminate\Http\Request;
use Laravolt\Indonesia\Models\City;
use Laravolt\Indonesia\Models\District;
use Laravolt\Indonesia\Models\Province;
use Laravolt\Indonesia\Models\Village;

class RegionsRepository
{
    public function province(Request $request)
    {
        try {
            $provinces = Province::orderBy('name', 'asc')->get();
            $response = collect([]);
            foreach ($provinces as $province) {
                $metas = [
                    'cities' => collect([])
                ];
                if (isset($request->complete)) {
                    $metas['cities'] = $this->city(new Request(['province' => $provinces->code, 'complete' => true]));
                }
                $response->push([
                    'value' => (int) $province->id,
                    'label' => ucwords(strtolower($province->name)),
                    'meta' => $metas,
                    'province_code' => $province->code
                ]);
            }
            return $response;
        } catch (\Exception $exception) {
            throw new \Exception($exception->getMessage(), 500);
        }
    }

    public function city(Request $request)
    {
        try {
            $provinces = Province::orderBy('name', 'asc')->where('id', '=', $request->province)->first();

            $response = collect([]);

            if ($provinces != null) {
                $cities = City::orderBy('name', 'asc');
                if (strlen($request->province) > 0) $cities = $cities->where('province_code', "=", $provinces->id);
                $cities = $cities->get();
                foreach ($cities as $city) {
                    $metas = ['districts' => collect([])];
                    if (isset($request->complete)) {
                        $metas['districts'] = $this->district(new Request(['city' => $city->code, 'complete' => true]));
                    }
                    $response->push([
                        'value' => (int) $city->id,
                        'label' => ucwords(strtolower($city->name)),
                        'meta' => $metas
                    ]);
                }
            }
            return $response;
        } catch (\Exception $exception) {
            throw new \Exception($exception->getMessage(), 500);
        }
    }

    public function district(Request $request)
    {
        try {

            $citys = City::orderBy('name', 'asc')->where('id', '=', $request->city)->first();

            $response = collect([]);

            if ($citys !== null) {
                $districts = District::orderBy('name', 'asc');
                if (strlen($request->city) > 0) $districts = $districts->where('city_code', "=", $citys->id);
                $districts = $districts->get();
                foreach ($districts as $district) {
                    $metas = ['villages' => collect([])];
                    if (isset($request->complete)) {
                        $metas['villages'] = $this->village(new Request(['district' => $district->code, 'complete' => true]));
                    }
                    $response->push([
                        'value' => (int) $district->id,
                        'label' => ucwords(strtolower($district->name)),
                        'meta' => $metas,
                        'postal' => $district->postal
                    ]);
                }
            }


            return $response;
        } catch (\Exception $exception) {
            throw new \Exception($exception->getMessage(), 500);
        }
    }

    public function village(Request $request)
    {
        try {
            $district = District::orderBy('name', 'asc')->where('id', '=', $request->district)->first();
            $response = collect([]);

            if ($district != null) {
                $villages = Village::orderBy('name', 'asc');
                if (strlen($request->district) > 0) $villages = $villages->where('district_code', "=", $district->id);
                $villages = $villages->get();
                foreach ($villages as $village) {
                    $response->push([
                        'value' => (int) $village->id,
                        'label' => ucwords(strtolower($village->name))
                    ]);
                }
                return $response;
            }
        } catch (\Exception $exception) {
            throw new \Exception($exception->getMessage(), 500);
        }
    }
}
