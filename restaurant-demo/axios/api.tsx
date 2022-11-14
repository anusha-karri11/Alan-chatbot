import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const BASEURL = "https://d3gubdoj4ncvsp.cloudfront.net/";

export const getCall = async (
  url: string,
  headers?: any,
  onSuccess?: (response: any) => void,
  onError?: (response: any) => void
) => {
  await axios
    .get(BASEURL + url, {
      headers: {
        authorization: (await AsyncStorage.getItem("authorization")) as string,
        ...headers,
      },
    })
    .then((response: any) => {
      if (onSuccess) {
        onSuccess(response);
      }
      // showResponse({
      //   message: `Your order id is ${response["data"]["order_summary"]["id"]}. Thanks for shopping with us.`,
      // });
    })
    .catch((error: any) => {
      if (onError) {
        onError(error.response);
      }
      console.log(error.response);
    });
};

export const postCall = async (
  url: string,
  data: any,
  headers?: any,
  onSuccess?: (response: any) => void,
  onError?: (response: any) => void
) => {
  await axios
    .post(BASEURL + url, data, {
      headers: {
        authorization: (await AsyncStorage.getItem("authorization")) as string,
        ...headers,
      },
    })
    .then((response: any) => {
      if (onSuccess) {
        onSuccess(response);
      }
    })
    .catch((error: any) => {
      if (onError) {
        onError(error.response);
      }
      console.log(error.response);
    });
};

export const googleLogin =(idToken:string, onSuccess?: (response: any) => void,
onError?: () => void)=>{
  axios
    .post(
      "https://d3gubdoj4ncvsp.cloudfront.net/dev/auth/api/user/oauth/customer",
      {
        token: idToken,
        oauth_type: "GOOGLE",
      }
    )
    .then((response) => {
      if (onSuccess) {
        onSuccess(response);
      }
    })
    .catch((e) => {
      console.log(e.response);
      if (onError) {
        onError();
      }
    });
}

export const login = (
  formData: FormData,
  onSuccess?: (response: any) => void,
  onError?: () => void
) => {
  axios
    .post(
      "https://d3gubdoj4ncvsp.cloudfront.net/dev/auth/api/user/login",
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data; boundary=----WebKitFormBoundaryuDNgHKZ9lV6iwfbo",
        },
      }
    )
    .then((response) => {
      if (onSuccess) {
        onSuccess(response);
      }
    })
    .catch((e) => {
      console.log(e.response);
      if (onError) {
        onError();
      }
    });
};
